import DemoCard from 'components/DemoCard';
import ExampleETHCard from 'components/eth/ExampleETHCard';
import ExampleSolCard from 'components/sol/ExampleSolCard';
import Logo from 'data/logo';

import Head from 'next/head';
import { useState } from 'react';

const Tab = ({ onChange, label, symbol }) => {
	return (
		<a
			className="bg-gray-50 px-4 rounded py-1 border cursor-pointer hover:bg-gray-100 flex items-center w-max"
			onClick={() => onChange(symbol.toLocaleLowerCase())}
		>
			{symbol && symbol !== 'other' && <img className="w-4 h-4 mr-2" src={Logo[symbol.toLowerCase()]} />}
			<span>{label}</span>
		</a>
	);
};

const SupportedCoin = ({ symbol, label }) => {
	return (
		<>
			<div className="flex items-center w-max">
				{symbol && symbol !== 'other' && <img className="w-4 h-4 mr-2" src={Logo[symbol.toLowerCase()]} />}
				<span>{label}</span>
			</div>
		</>
	);
};

export default function Home() {
	const [activeTab, setActiveTab] = useState('eth');

	return (
		<div>
			<Head>
				<title>w3auth demo</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<section className="mb-5 space-x-5 flex items-center">
					<Tab onChange={(val) => setActiveTab(val)} symbol="ETH" label={'ETH'} />
					{/* <Tab onChange={(val) => setActiveTab(val)} symbol="SOL" label={'SOL'} /> */}
					<Tab onChange={(val) => setActiveTab(val)} symbol="other" label={'Other Chain'} />
				</section>

				{activeTab == 'eth' && (
					<>
						<DemoCard
							symbol={'ETH'}
							details="Integration using RainbowKit, Wagmi"
							code="https://github.com/Devzstudio/w3auth_demo/tree/main/components/eth"
						/>

						<ExampleETHCard />
					</>
				)}

				{/* {activeTab == 'sol' && (
					<>
						<DemoCard
							symbol={'SOL'}
							details="Integration using WalletKit, useSolana"
							code="https://github.com/Devzstudio/w3auth_demo/tree/main/components/sol"
						/>

						<ExampleSolCard />
					</>
				)} */}

				{activeTab == 'other' && (
					<>
						<div className="bg-gray-50 rounded-t p-5 border relative overflow-hidden ">
							<p className="mb-5">
								You can check ETH Sample Integration on{' '}
								<a
									href="https://github.com/Devzstudio/w3auth_demo"
									target="_BLANK"
									className="text-blue-500"
								>
									https://github.com/Devzstudio/w3auth_demo
								</a>
							</p>

							<h3 className="text-xl font-medium block mb-2">Other Chain</h3>

							<p>You can integrate following blockchain in w3auth.</p>

							<b className="mt-5 block">Supported Chains</b>

							<div className="space-y-2 mt-2">
								<SupportedCoin symbol={'ETH'} label="Ethereum" />
								<SupportedCoin symbol={'SOL'} label="Solana" />
								<SupportedCoin symbol={'DOT'} label="Polkadot" />
								<SupportedCoin symbol={'FLOW'} label="Flow" />
								<SupportedCoin symbol={'NEAR'} label="Near" />
							</div>
							<p className="mt-2 block">
								<a
									className="text-blue-500 mr-2"
									href="https://github.com/Devzstudio/w3auth/issues/new/choose"
									target="_BLANK"
								>
									Open an issue
								</a>
								if the chain you want isn't supported
							</p>
						</div>
					</>
				)}
			</main>
		</div>
	);
}
