import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';
import { loadConsolidated } from '@dex/tokenlists';
import type { PricesResponse } from '@dex/types';

const PORT = Number(process.env.PORT || 4002);
const DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN || 'http://localhost:3000';

const app = Fastify({ logger: true });
await app.register(cors, { origin: [DASHBOARD_ORIGIN] });
await app.register(rateLimit, { max: 200, timeWindow: '1 minute' });

app.get('/health', async () => ({ ok: true }));

app.get('/tokenlists', async () => {
	return await loadConsolidated();
});

const PricesQuery = z.object({ chainId: z.string(), addresses: z.array(z.string()) });

app.get('/prices', async (req, res) => {
	const parsed = PricesQuery.safeParse({
		chainId: (req.query as any)?.chainId,
		addresses: ((req.query as any)?.addresses as string[] | string) ?? [],
	});
	if (!parsed.success) return res.status(400).send({ error: parsed.error.flatten() });
	const { chainId, addresses } = parsed.data;
	// TODO: call CoinGecko/CMC; for now, stub with 0
	const prices: PricesResponse['prices'] = addresses.map((a) => ({ address: a, priceUsd: 0 }));
	return { chainId, prices } satisfies PricesResponse;
});

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
	app.log.info(`price-service listening on ${PORT}`);
});