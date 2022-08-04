import { WagmiConfig } from 'wagmi';

import { chains, wagmiClient } from 'components/eth/connectors';
import Layout from 'components/layout';
import { AuthProvider } from 'context/auth.context';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import { WalletKitProvider } from '@gokiprotocol/walletkit';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains}>
					{/* <WalletKitProvider
						defaultNetwork="devnet"
						app={{
							name: 'w3auth demo',
							icon: <img src="https://goki.so/assets/android-chrome-256x256.png" alt="icon" />,
						}}
						debugMode={true} // you may want to set this in REACT_APP_DEBUG_MODE
					> */}
					<Layout>
						<Component {...pageProps} />
					</Layout>
					{/* </WalletKitProvider> */}
				</RainbowKitProvider>
			</WagmiConfig>
			<Toaster />
		</AuthProvider>
	);
}

export default MyApp;
