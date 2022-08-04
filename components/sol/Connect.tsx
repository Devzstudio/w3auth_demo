import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import Logo from 'data/logo';
import { API_URL } from 'hooks/useRequest';
import w3auth from 'hooks/useW3auth';
import { useCallback, useEffect, useState } from 'react';
import useNonceHandler from './useNonceHandler';

const Connect = () => {
	const { verifySign, getNonce, logout, refresh } = w3auth(API_URL);

	const sol = useSolana();
	const wallet = useConnectedWallet();

	const { processDisconnect } = useNonceHandler({
		account: {
			address: wallet?.publicKey?.toString(),
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
