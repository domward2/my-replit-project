import React, { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export function SolanaProviders({ children }: { children: React.ReactNode }) {
	const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('mainnet-beta');
	const wallets = useMemo(
		() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new SolongWalletAdapter()],
		[]
	);
	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export function SolanaConnectButton() {
	return <WalletMultiButton className="btn" />;
}