import { AggregatorQuote, QuoteRequest } from '@dex/types';

const PARASWAP_API_BASE = process.env.PARASWAP_API_BASE || 'https://api.paraswap.io';

export async function quoteParaSwap(req: QuoteRequest, signal?: AbortSignal): Promise<AggregatorQuote | null> {
	try {
		const network = chainToId(req.chainId);
		if (!network) return null;
		const search = new URLSearchParams();
		search.set('from', req.fromToken);
		search.set('to', req.toToken);
		search.set('amount', req.amount);
		search.set('side', 'SELL');
		const url = `${PARASWAP_API_BASE}/prices/?${search.toString()}`;
		const res = await fetch(url, { headers: { 'x-chain-id': String(network) }, signal });
		if (!res.ok) return null;
		const data: any = await res.json();
		const bestRoute = data?.priceRoute;
		if (!bestRoute) return null;
		const amountOut = bestRoute?.destAmount ?? '0';
		return {
			aggregator: 'paraswap',
			amountIn: req.amount,
			amountOut,
			gasEstimateNative: bestRoute?.gasCost ? String(bestRoute.gasCost) : undefined,
			approvals: [],
			txType: 'evm_call',
			meta: { bestRoute },
		};
	} catch {
		return null;
	}
}

function chainToId(chain: string): number | null {
	switch (chain) {
		case 'ethereum':
			return 1;
		case 'polygon':
			return 137;
		case 'arbitrum':
			return 42161;
		case 'optimism':
			return 10;
		case 'base':
			return 8453;
		case 'bsc':
			return 56;
		case 'avalanche':
			return 43114;
		default:
			return null;
	}
}