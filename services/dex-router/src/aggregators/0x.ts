import { AggregatorQuote, QuoteRequest } from '@dex/types';

const ZEROX_API_BASE = process.env.ZEROX_API_BASE || 'https://api.0x.org';

export async function quote0x(req: QuoteRequest, signal?: AbortSignal): Promise<AggregatorQuote | null> {
	try {
		const search = new URLSearchParams();
		// 0x expects sellToken/buyToken and sellAmount (wei)
		search.set('sellToken', req.fromToken);
		search.set('buyToken', req.toToken);
		search.set('sellAmount', req.amount);
		search.set('slippagePercentage', String(req.slippageBps / 10000));
		// v2 supports multi-chain via chainId param
		search.set('chainId', chainToZeroXId(req.chainId));
		const url = `${ZEROX_API_BASE}/swap/v2/quote?${search.toString()}`;
		const res = await fetch(url, { signal });
		if (!res.ok) return null;
		const data: any = await res.json();
		const amountOut = data?.buyAmount ?? '0';
		const gasEstimateNative = data?.gas || data?.gasPrice ? String(BigInt(data.gas) * BigInt(data.gasPrice)) : undefined;
		const to = data?.to;
		const callData = data?.data;
		const value = data?.value;
		return {
			aggregator: '0x',
			amountIn: req.amount,
			amountOut,
			gasEstimateNative,
			toSign: to && callData ? { evm: { to, data: callData, value } } : undefined,
			approvals: [],
			txType: 'evm_call',
			meta: { protocolFee: data?.protocolFee, sources: data?.sources },
		};
	} catch {
		return null;
	}
}

function chainToZeroXId(chain: string): string {
	switch (chain) {
		case 'ethereum':
			return '1';
		case 'polygon':
			return '137';
		case 'arbitrum':
			return '42161';
		case 'optimism':
			return '10';
		case 'base':
			return '8453';
		case 'bsc':
			return '56';
		case 'avalanche':
			return '43114';
		default:
			return '1';
	}
}