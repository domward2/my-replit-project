"use client";
import React from 'react';
import { ChainSelector, TokenSelector, SlippageControl, RouteTable, AmountInput } from './components';
import type { AggregatorQuote } from '@dex/types';
import { ConnectButton } from '@dex/evm-connect';
import { SolanaConnectButton } from '@dex/solana-connect';
import { getQuotes } from './lib/api';

export default function DexPage() {
	const [chain, setChain] = React.useState<string | undefined>();
	const [from, setFrom] = React.useState<string | undefined>();
	const [to, setTo] = React.useState<string | undefined>();
	const [slippage, setSlippage] = React.useState<number>(50);
	const [amount, setAmount] = React.useState<string>('');
	const [quotes, setQuotes] = React.useState<AggregatorQuote[]>([]);
	const [loading, setLoading] = React.useState(false);

	async function onGetQuotes() {
		if (!chain || !from || !to || !amount) return;
		setLoading(true);
		try {
			const body = { chainId: chain, fromToken: from, toToken: to, amount, walletAddress: '0x', slippageBps: slippage };
			const res = await getQuotes(body);
			setQuotes(res.quotes || []);
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="p-6 space-y-4">
			<div className="flex items-center gap-3">
				<ConnectButton />
				<SolanaConnectButton />
			</div>
			<div className="flex items-center gap-3">
				<ChainSelector value={chain as any} onChange={setChain as any} />
				<TokenSelector tokens={[]} value={from} onChange={setFrom as any} />
				<TokenSelector tokens={[]} value={to} onChange={setTo as any} />
				<AmountInput value={amount} onChange={setAmount} />
				<SlippageControl valueBps={slippage} onChange={setSlippage} />
				<button className="border rounded px-3 py-1" onClick={onGetQuotes} disabled={loading}>
					{loading ? 'Loading...' : 'Get Quotes'}
				</button>
			</div>
			<RouteTable quotes={quotes} onSelect={(q) => console.log('select', q)} />
		</main>
	)
}