import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

export interface TokenInfo {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface TokenList {
  name: string;
  timestamp: string;
  version: { major: number; minor: number; patch: number };
  tokens: TokenInfo[];
}

export async function loadLocalList(name: string): Promise<TokenList> {
  const p = join(process.cwd(), 'packages/tokenlists/lists', `${name}.tokenlist.json`);
  const raw = await readFile(p, 'utf8');
  return JSON.parse(raw);
}

export async function loadConsolidated(): Promise<TokenList> {
  const distPath = join(process.cwd(), 'packages/tokenlists/dist', 'consolidated.tokenlist.json');
  try {
    await access(distPath);
    const raw = await readFile(distPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    const uni = await loadLocalList('uniswap-example').catch(() => ({ tokens: [] } as any));
    const quick = await loadLocalList('quickswap-example').catch(() => ({ tokens: [] } as any));
    const map = new Map<string, TokenInfo>();
    for (const t of [...uni.tokens, ...quick.tokens]) map.set(`${t.chainId}:${t.address.toLowerCase()}`, t);
    return {
      name: 'DEX Consolidated',
      timestamp: new Date().toISOString(),
      version: { major: 0, minor: 1, patch: 0 },
      tokens: Array.from(map.values()),
    };
  }
}