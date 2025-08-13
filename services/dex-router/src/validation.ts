import { z } from 'zod';

export const AggregatorEnum = z.enum(['0x', '1inch', 'paraswap', 'openocean', 'jupiter']);

export const QuoteSchema = z.object({
	chainId: z.string(),
	fromToken: z.string(),
	toToken: z.string(),
	amount: z.string(),
	walletAddress: z.string(),
	slippageBps: z.number().int().min(0).max(5000),
	preferAggregators: z.array(AggregatorEnum).optional(),
	excludeAggregators: z.array(AggregatorEnum).optional(),
});

export const BuildSchema = z.object({
	route: z.object({ aggregator: AggregatorEnum }).passthrough(),
	walletAddress: z.string(),
});

export const StatusSchema = z.object({ chainId: z.string(), txHash: z.string() });