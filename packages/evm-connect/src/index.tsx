import React, { useMemo } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche } from 'wagmi/chains';

const ALL_CHAINS = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche] as const;

export function makeWagmiConfig() {
	const supportedEnv = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS?.split(',') || [];
	const chains = (ALL_CHAINS as readonly typeof ALL_CHAINS[number][]).filter((c) => supportedEnv.includes(c.name.toLowerCase()));
	const transports: Record<number, ReturnType<typeof http>> = {};
	for (const chain of chains) transports[chain.id] = http();
	const config = createConfig({ chains: chains as any, transports, ssr: true });
	return config;
}

export function EvmProviders({ children }: { children: React.ReactNode }) {
	const config = useMemo(() => makeWagmiConfig(), []);
	return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export function ConnectButton() {
	return (
		<button className="border rounded px-3 py-1" disabled>
			Connect (configure Web3Modal later)
		</button>
	);
}