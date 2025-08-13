import React, { useEffect, useMemo } from 'react';
import { createConfig, http } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche } from 'wagmi/chains';
import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal } from '@web3modal/wagmi/react';

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'changeme';

const ALL_CHAINS = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche] as const;

export function makeWagmiConfig() {
	const supported = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS?.split(',') || [];
	const chains = ALL_CHAINS.filter((c) => supported.includes(c.network));
	const transports: Record<number, ReturnType<typeof http>> = {};
	for (const chain of chains) transports[chain.id] = http();
	const config = createConfig({ chains, transports, ssr: true });
	return config;
}

export function EvmProviders({ children }: { children: React.ReactNode }) {
	const config = useMemo(() => makeWagmiConfig(), []);
	useEffect(() => {
		createWeb3Modal({ wagmiConfig: config, projectId: WC_PROJECT_ID });
	}, [config]);
	return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export function ConnectButton() {
	const { open } = useWeb3Modal();
	return (
		<button className="border rounded px-3 py-1" onClick={() => open()}>
			Connect Wallet
		</button>
	);
}