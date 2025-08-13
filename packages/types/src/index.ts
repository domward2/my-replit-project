export type SupportedChain =
  | 'ethereum'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'bsc'
  | 'avalanche'
  | 'solana';

export type AggregatorName = '0x' | '1inch' | 'paraswap' | 'openocean' | 'jupiter';

export type TxType = 'evm_call' | 'solana_tx';

export interface QuoteRequest {
  chainId: SupportedChain;
  fromToken: string; // address (EVM) or mint (Solana)
  toToken: string; // address (EVM) or mint (Solana)
  amount: string; // amount in smallest units (wei/lamports)
  walletAddress: string;
  slippageBps: number;
  preferAggregators?: AggregatorName[];
  excludeAggregators?: AggregatorName[];
}

export interface NormalizedApproval {
  token: string; // token address
  spender: string; // spender address
  amount: string; // allowance amount (wei)
  permit2?: {
    enabled: boolean;
    data?: string; // calldata or permit payload when applicable
  };
}

export interface EVMSwapCallData {
  to: string;
  data: string;
  value?: string;
  gas?: string;
  chainId?: number;
}

export interface SolanaSerializedTx {
  serializedBase64: string;
}

export type ToSign = { evm?: EVMSwapCallData; solana?: SolanaSerializedTx };

export interface AggregatorQuote {
  aggregator: AggregatorName;
  amountIn: string; // in fromToken units (wei/lamports)
  amountOut: string; // in toToken units (wei/lamports)
  gasEstimateNative?: string; // native token units (wei for EVM); not applicable on Solana
  fee?: string; // fee in toToken units when available
  toSign?: ToSign; // swap transaction if provided at quote time
  approvals?: NormalizedApproval[];
  txType: TxType;
  meta?: Record<string, unknown>;
}

export interface QuoteResponse {
  quotes: AggregatorQuote[];
}

export interface BuildRequest {
  route: AggregatorQuote;
  walletAddress: string;
}

export interface BuildResponse {
  approvals: NormalizedApproval[];
  toSign: ToSign;
}

export interface TxStatusRequest {
  chainId: SupportedChain;
  txHash: string;
}

export type TxStatus = 'pending' | 'success' | 'failed' | 'unknown';

export interface TxStatusResponse {
  status: TxStatus;
  explorerUrl?: string;
}

export interface PriceQuery {
  chainId: SupportedChain;
  addresses: string[];
}

export interface PriceEntry {
  address: string;
  priceUsd: number;
  symbol?: string;
  decimals?: number;
}

export interface PricesResponse {
  chainId: SupportedChain;
  prices: PriceEntry[];
}