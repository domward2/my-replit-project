const DEX_ROUTER = process.env.NEXT_PUBLIC_DEX_ROUTER_URL || 'http://localhost:4001';
const PRICE_SERVICE = process.env.NEXT_PUBLIC_PRICE_SERVICE_URL || 'http://localhost:4002';

export async function getTokenLists() {
	const res = await fetch(`${PRICE_SERVICE}/tokenlists`, { cache: 'no-store' });
	if (!res.ok) throw new Error('Failed to load token lists');
	return res.json();
}

export async function getQuotes(body: any) {
	const res = await fetch(`${DEX_ROUTER}/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	if (!res.ok) throw new Error('Failed to get quotes');
	return res.json();
}

export async function buildSwap(body: any) {
	const res = await fetch(`${DEX_ROUTER}/build`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	if (!res.ok) throw new Error('Failed to build swap');
	return res.json();
}

export async function getPrices(chainId: string, addresses: string[]) {
	const params = new URLSearchParams({ chainId });
	for (const a of addresses) params.append('addresses', a);
	const res = await fetch(`${PRICE_SERVICE}/prices?${params.toString()}`, { cache: 'no-store' });
	if (!res.ok) throw new Error('Failed to get prices');
	return res.json();
}