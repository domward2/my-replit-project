import { AggregatorQuote, QuoteRequest } from '@dex/types';

const JUPITER_API_BASE = process.env.JUPITER_API_BASE || 'https://quote-api.jup.ag';

export async function quoteJupiter(req: QuoteRequest, signal?: AbortSignal): Promise<AggregatorQuote | null> {
	if (req.chainId !== 'solana') return null;
	try {
		const search = new URLSearchParams();
		search.set('inputMint', req.fromToken);
		search.set('outputMint', req.toToken);
		search.set('amount', req.amount);
		search.set('slippageBps', String(req.slippageBps));
		const url = `${JUPITER_API_BASE}/v6/quote?${search.toString()}`;
		const res = await fetch(url, { signal });
		if (!res.ok) return null;
		const data: any = await res.json();
		const best = data?.data?.[0];
		if (!best) return null;
		return {
			aggregator: 'jupiter',
			amountIn: req.amount,
			amountOut: String(best.outAmount ?? '0'),
			txType: 'solana_tx',
			approvals: [],
			meta: best,
		};
	} catch {
		return null;
	}
}