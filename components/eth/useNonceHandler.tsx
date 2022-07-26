import { useRouter } from 'next/router';

import { useSignMessage, useDisconnect } from 'wagmi';

import { verifyMessage } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

import Config from 'lib/config';
import { AuthActionTypes, useAuth } from 'context/auth.context';
import { API_URL } from 'hooks/useRequest';
import toast from 'react-hot-toast';

const useNonceHandler = ({ account }) => {
	const recoveredAddress = React.useRef<string>();

	const [userResponse, setUserReponse] = useState(null);
	const [refreshFailed, setRefreshFailed] = useState(false);

	const { disconnect } = useDisconnect();

	const { data, error, isLoading, signMessage } = useSignMessage({
		async onSuccess(data, variables) {
			const address = verifyMessage(variables.message, data);
			recoveredAddress.current = address;

			if (data != '') {
				const verifyCall = await fetch(API_URL + '/api/auth/verify', {
					method: 'POST',

					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						signature: data,
						signed_message: variables.message,
						wallet_address: account.address,
					}),
				});

				const user_response = await verifyCall.json();

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

	const router = useRouter();
	const { auth, authDispatch } = useAuth();

	/*
	 * Get nonce from backend , verify it with the signature and save to context
	 */

	const handleSignature = useCallback(async () => {
		if (account?.address && auth.token == null && refreshFailed) {
			const nonceCall = await fetch(API_URL + '/api/auth/nonce', {
				method: 'POST',

				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet_address: account.address }),
			});

			const nonceData = await nonceCall.json();

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
		await fetch(API_URL + '/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: '',
		});

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
				const refreshCall = await fetch(API_URL + '/api/auth/refresh', {
					method: 'POST',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({}),
				});
				setRefreshFailed(true);

				const user_response = await refreshCall.json();

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
