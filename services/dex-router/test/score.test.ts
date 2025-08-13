import { describe, it, expect } from 'vitest';
import { scoreRoutes } from '../src/routing/score';
import type { AggregatorQuote } from '@dex/types';

describe('scoreRoutes', () => {
	it('ranks quotes by net amountOut', () => {
		const quotes: AggregatorQuote[] = [
			{ aggregator: '0x', amountIn: '1000', amountOut: '900', txType: 'evm_call' },
			{ aggregator: '1inch', amountIn: '1000', amountOut: '950', txType: 'evm_call' },
			{ aggregator: 'paraswap', amountIn: '1000', amountOut: '920', txType: 'evm_call' },
		];
		const ranked = scoreRoutes(quotes);
		expect(ranked[0].aggregator).toBe('1inch');
	});
});