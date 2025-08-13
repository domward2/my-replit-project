import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { QuoteRequest, QuoteResponse, BuildRequest, BuildResponse, TxStatusRequest, TxStatusResponse } from '@dex/types';
import { QuoteSchema, BuildSchema, StatusSchema } from './validation';
import { quote0x } from './aggregators/0x';
import { quoteOneInch } from './aggregators/oneinch';
import { quoteParaSwap } from './aggregators/paraswap';
import { quoteOpenOcean } from './aggregators/openocean';
import { quoteJupiter } from './aggregators/jupiter';
import { scoreRoutes } from './routing/score';

const PORT = Number(process.env.PORT || 4001);
const DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN || 'http://localhost:3000';

const app = Fastify({ logger: true });

await app.register(cors, { origin: [DASHBOARD_ORIGIN] });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

app.get('/health', async () => ({ ok: true }));

app.post('/quote', async (req, res) => {
	const parsed = QuoteSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).send({ error: parsed.error.flatten() });
	const body = parsed.data as QuoteRequest;

	const abort = new AbortController();
	const timeout = setTimeout(() => abort.abort(), 8000);
	try {
		const tasks = [quote0x(body, abort.signal), quoteOneInch(body, abort.signal), quoteParaSwap(body, abort.signal), quoteOpenOcean(body, abort.signal)];
		if (body.chainId === 'solana') tasks.push(quoteJupiter(body, abort.signal));
		const results = await Promise.all(tasks);
		const quotes = results.filter(Boolean) as QuoteResponse['quotes'];
		const ranked = scoreRoutes(quotes);
		return { quotes: ranked } satisfies QuoteResponse;
	} finally {
		clearTimeout(timeout);
	}
});

app.post('/build', async (req, res) => {
	const parsed = BuildSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).send({ error: parsed.error.flatten() });
	const body = parsed.data as BuildRequest;
	// TODO: implement builder per aggregator, include Permit2 path where possible
	const toSign = body.route.txType === 'evm_call' ? { evm: { to: '0x0000000000000000000000000000000000000000', data: '0x' } } : { solana: { serializedBase64: '' } };
	const approvals = [];
	return { approvals, toSign } satisfies BuildResponse;
});

app.post('/status', async (req, res) => {
	const parsed = StatusSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).send({ error: parsed.error.flatten() });
	const _body = parsed.data as TxStatusRequest;
	// TODO: implement provider/explorer polling
	return { status: 'unknown' } satisfies TxStatusResponse;
});

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
	app.log.info(`dex-router listening on ${PORT}`);
});