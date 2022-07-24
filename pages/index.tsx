import DemoCard from 'components/DemoCard';
import ExampleCard from 'components/DemoCard/ExampleCard';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
	return (
		<div>
			<Head>
				<title>w3auth demo</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<DemoCard symbol={'ETH'} details="Integration using RainbowKit, Wagmi" />

				<ExampleCard />
			</main>
		</div>
	);
}
