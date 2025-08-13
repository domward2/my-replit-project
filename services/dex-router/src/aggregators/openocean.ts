import { AggregatorQuote, QuoteRequest } from '@dex/types';

const OPENOCEAN_API_BASE = process.env.OPENOCEAN_API_BASE || 'https://open-api.openocean.finance';

export async function quoteOpenOcean(req: QuoteRequest, signal?: AbortSignal): Promise<AggregatorQuote | null> {
	try {
		const chainId = chainToName(req.chainId);
		if (!chainId) return null;
		const search = new URLSearchParams();
		search.set('chain', chainId);
		search.set('inTokenAddress', req.fromToken);
		search.set('outTokenAddress', req.toToken);
		search.set('amount', req.amount);
		const url = `${OPENOCEAN_API_BASE}/v4/${chainId}/quote?${search.toString()}`;
		const res = await fetch(url, { signal });
		if (!res.ok) return null;
		const data: any = await res.json();
		const amountOut = data?.data?.outAmount || data?.outAmount || '0';
		return {
			aggregator: 'openocean',
			amountIn: req.amount,
			amountOut,
			gasEstimateNative: data?.data?.estimatedGas || data?.estimatedGas,
			approvals: [],
			txType: 'evm_call',
			meta: data?.data || data,
		};
	} catch {
		return null;
	}
}

function chainToName(chain: string): string | null {
	switch (chain) {
		case 'ethereum':
			return 'eth';
		case 'polygon':
			return 'polygon';
		case 'arbitrum':
			return 'arbitrum';
		case 'optimism':
			return 'optimism';
		case 'base':
			return 'base';
		case 'bsc':
			return 'bsc';
		case 'avalanche':
			return 'avalanche';
		default:
			return null;
	}
}