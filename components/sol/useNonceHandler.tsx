import { useCallback, useEffect, useState } from 'react';
import React from 'react';

import Config from 'lib/config';
import { AuthActionTypes, useAuth } from 'context/auth.context';
import { API_URL } from 'hooks/useRequest';
import toast from 'react-hot-toast';
import w3auth from 'hooks/useW3auth';
import { useSolana } from '@saberhq/use-solana';

const useNonceHandler = ({ account }) => {
	const recoveredAddress = React.useRef<string>();
	const { verifySign, getNonce, logout, refresh } = w3auth(API_URL);
	const { walletProviderInfo, disconnect, providerMut, network, setNetwork } = useSolana();

	const [userResponse, setUserReponse] = useState(null);
	const [refreshFailed, setRefreshFailed] = useState(false);

	const { auth, authDispatch } = useAuth();

	const signMessage = useCallback(async (message) => {
		if (account.address) {
			if (!(window as any).solana) {
				toast.error('Oops cannot sign message on solana.');
			}

			const signature = await (window as any).solana.signMessage(new TextEncoder().encode(message), 'utf8');

			recoveredAddress.current = account.address;

			if (signature != '') {
				const user_response = await verifySign({
					signature: message,
					signed_message: signature,
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
		}
	}, []);

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

	return {
		processDisconnect,
	};
};

export default useNonceHandler;
