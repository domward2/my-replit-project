import { AggregatorQuote, QuoteRequest } from '@dex/types';

const ONEINCH_API_BASE = process.env.ONEINCH_API_BASE || 'https://api.1inch.dev';
const ONEINCH_API_KEY = process.env.ONEINCH_API_KEY || '';

export async function quoteOneInch(req: QuoteRequest, signal?: AbortSignal): Promise<AggregatorQuote | null> {
	try {
		const headers: Record<string, string> = {};
		if (ONEINCH_API_KEY) headers['Authorization'] = `Bearer ${ONEINCH_API_KEY}`;
		// 1inch uses numeric chain IDs per network in the path
		const chainId = chainToId(req.chainId);
		if (!chainId) return null;
		const search = new URLSearchParams();
		search.set('src', req.fromToken);
		search.set('dst', req.toToken);
		search.set('amount', req.amount);
		const url = `${ONEINCH_API_BASE}/swap/v5.2/${chainId}/quote?${search.toString()}`;
		const res = await fetch(url, { headers, signal });
		if (!res.ok) return null;
		const data: any = await res.json();
		const amountOut = data?.dstAmount ?? '0';
		return {
			aggregator: '1inch',
			amountIn: req.amount,
			amountOut,
			gasEstimateNative: data?.gas ? String(data.gas) : undefined,
			approvals: [],
			txType: 'evm_call',
			meta: { protocols: data?.protocols },
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