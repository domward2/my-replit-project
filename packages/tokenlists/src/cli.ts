#!/usr/bin/env node
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function main() {
	const now = new Date().toISOString();
	const listsDir = join(process.cwd(), 'packages/tokenlists/lists');
	const uniRaw = await readFile(join(listsDir, 'uniswap-example.tokenlist.json'), 'utf8').catch(() => '');
	const quickRaw = await readFile(join(listsDir, 'quickswap-example.tokenlist.json'), 'utf8').catch(() => '');
	const uni = uniRaw ? JSON.parse(uniRaw) : { tokens: [] };
	const quick = quickRaw ? JSON.parse(quickRaw) : { tokens: [] };
	const tokenMap = new Map<string, any>();
	for (const t of [...uni.tokens, ...quick.tokens]) {
		const key = `${t.chainId}:${t.address.toLowerCase()}`;
		tokenMap.set(key, t);
	}
	const consolidated = {
		name: 'DEX Consolidated',
		timestamp: now,
		version: { major: 0, minor: 1, patch: 0 },
		tokens: Array.from(tokenMap.values()),
	};
	const outPath = join(process.cwd(), 'packages/tokenlists/dist', 'consolidated.tokenlist.json');
	await writeFile(outPath, JSON.stringify(consolidated, null, 2));
	console.log('Wrote', outPath, 'with', consolidated.tokens.length, 'tokens');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});