import { useSignMessage, useDisconnect } from 'wagmi';

import { verifyMessage } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

import Config from 'lib/config';
import { AuthActionTypes, useAuth } from 'context/auth.context';
import { API_URL } from 'hooks/useRequest';
import toast from 'react-hot-toast';
import w3auth from 'hooks/useW3auth';

const useNonceHandler = ({ account }) => {
	const recoveredAddress = React.useRef<string>();
	const { verifySign, getNonce, logout, refresh } = w3auth(API_URL);

	const [userResponse, setUserReponse] = useState(null);
	const [refreshFailed, setRefreshFailed] = useState(false);

	const { disconnect } = useDisconnect();

	const { error, signMessage } = useSignMessage({
		async onSuccess(data, variables) {
			const address = verifyMessage(variables.message, data);
			recoveredAddress.current = address;

			if (data != '') {
				const user_response = await verifySign({
					signature: data,
					signed_message: variables.message,
					wallet_address: account.address,
				});

				if (user_response.error) {
					toast.error(user_response.error);
					processDisconnect();
				} else {
					window.localStorage.setItem('refresh_token', 'true');

					setUserReponse(user_response);
				}
			} else {
				processDisconnect();
			}
		},
	});

	const { auth, authDispatch } = useAuth();

	/*
	 * Get nonce from backend , verify it with the signature and save to context
	 */

	const handleSignature = useCallback(async () => {
		if (account?.address && auth.token == null && refreshFailed) {
			const nonceData = await getNonce({
				wallet_address: account.address,
			});

			if (nonceData.error) {
				toast.error(nonceData.error);
				disconnect();
			}

			if (nonceData.nonce) {
				const message = `${Config.SignMessageText} ${nonceData.nonce} \n Address: ${account.address}`;

				await signMessage({ message });
			}
		}
	}, [account, auth, signMessage]);

	const processDisconnect = useCallback(async () => {
		logout();

		authDispatch({
			type: AuthActionTypes.LOGOUT,
		});

		window.localStorage.removeItem('refresh_token');

		disconnect();
	}, [authDispatch, disconnect]);

	/*
	 *	Refresh state
	 */

	const handleRefreshToken = useCallback(async () => {
		if (auth.token == null) {
			const refreshToken = window.localStorage.getItem('refresh_token');

			if (refreshToken) {
				const user_response = await refresh();

				setRefreshFailed(true);
				if (user_response.error) {
					toast.error(user_response.error);
					processDisconnect();
				} else {
					window.localStorage.setItem('refresh_token', 'true');

					setUserReponse(user_response);
				}
			} else {
				setRefreshFailed(true);
			}
		}
	}, [auth]);

	useEffect(() => {
		handleRefreshToken();
	}, [handleRefreshToken]);

	useEffect(() => {
		if (error) {
			toast.error('User rejected request');
			processDisconnect();
		}
	}, [error, processDisconnect]);

	useEffect(() => {
		if (auth.token == null && account?.address) {
			handleSignature();
		}
	}, [refreshFailed]);

	useEffect(() => {
		if (userResponse) {
			authDispatch({
				type: AuthActionTypes.SET_USER,
				payload: userResponse,
			});
		}
	}, [userResponse, authDispatch]);

	return {};
};

export default useNonceHandler;
