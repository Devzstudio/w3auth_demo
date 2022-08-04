import React, { useState, useEffect } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

function DotConnect() {
	const [accounts, setAccounts] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		extensionSetup();
	}, []);

	const extensionSetup = async () => {
		const extensions = await web3Enable('Wallet-connect-tutorial');
		if (extensions.length === 0) {
			setError('No extension installed!');
			return;
		}
		const accounts = await web3Accounts();
		const injector = await web3FromAddress(accounts[0].address);

		setAccounts(accounts);
	};

	return (
		<div className="App">
			{error && <div>Error: {error}</div>}
			{accounts.map((account) => (
				<div style={{ marginTop: 10 }}>{account.address}</div>
			))}
		</div>
	);
}

export default DotConnect;
