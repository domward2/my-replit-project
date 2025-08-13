"use client";
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EvmProviders } from '@dex/evm-connect';
import { SolanaProviders } from '@dex/solana-connect';

const client = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={client}>
			<EvmProviders>
				<SolanaProviders>{children}</SolanaProviders>
			</EvmProviders>
		</QueryClientProvider>
	);
}