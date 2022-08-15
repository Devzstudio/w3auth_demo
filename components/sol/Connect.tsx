import { useW3auth } from '@devzstudio/w3auth-hook';
import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { AuthActionTypes, useAuth } from 'context/auth.context';
import Logo from 'data/logo';
import { API_URL } from 'hooks/useRequest';
import { useW3authAPI } from '@devzstudio/w3auth-hook';
import Config from 'lib/config';

import { useEffect } from 'react';

const Connect = () => {
	const { verifySign, getNonce, logout, refresh } = useW3authAPI(API_URL);
	const { walletProviderInfo, disconnect, providerMut, network, setNetwork } = useSolana();

	const { auth, authDispatch } = useAuth();

	const sol = useSolana();
	const wallet = useConnectedWallet();

	const { verifySignIn, processDisconnect } = useW3auth({
		API_URL: API_URL,
		wallet_address: wallet?.publicKey?.toString(),
		signMessageText: Config.SignMessageText,
		token: auth.token,
		onLogout: () => {
			disconnect();
		},
		onSignIn: (response) => {
			if (response) {
				authDispatch({
					type: AuthActionTypes.SET_USER,
					payload: response,
				});
			}
		},
		signMessage: async (message) => {
			// Solana function to sign message
			// await signMessage({ message });
		},
	});

	useEffect(() => {
		console.log(wallet?.publicKey?.toString());
		console.log('useSolana');
		console.log(sol);
	}, [wallet]);

	return (
		<>
			{wallet ? (
				<>
					<div className="flex items-center bg-gray-100 text-gray-500 text-sm rounded px-3 py-1 divide-x divide-gray-300 mr-2">
						<img src={Logo.sol} className="w-4 h-4 mr-2" /> {wallet?.publicKey?.toString()}
					</div>

					<button onClick={() => processDisconnect()}>Logout</button>
				</>
			) : (
				<div>
					<ConnectWalletButton />
				</div>
			)}
		</>
	);
};

export default Connect;
