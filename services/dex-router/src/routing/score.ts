import type { AggregatorQuote } from '@dex/types';

export interface ScoredRoute extends AggregatorQuote {
	score: number;
}

export function scoreRoutes(quotes: AggregatorQuote[]): ScoredRoute[] {
	return quotes
		.map((q) => ({ ...q, score: Number(q.amountOut || '0') - Number(q.fee || '0') }))
		.sort((a, b) => b.score - a.score);
}