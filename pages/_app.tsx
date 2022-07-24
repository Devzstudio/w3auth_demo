import { WagmiConfig } from 'wagmi';

import { chains, wagmiClient } from 'components/eth/connectors';
import Layout from 'components/layout';
import { AuthProvider } from 'context/auth.context';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</RainbowKitProvider>
			</WagmiConfig>
			<Toaster />
		</AuthProvider>
	);
}

export default MyApp;
