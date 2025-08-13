### Architecture

- Monorepo managed by pnpm + TurboRepo
- Frontend: Next.js 14 (App Router), Tailwind, Radix-ready UI via `@dex/ui`
- Backend services:
  - `dex-router`: queries 0x, 1inch, ParaSwap, OpenOcean (EVM) and Jupiter (Solana), normalizes and ranks routes, returns calldata/txs
  - `price-service`: serves consolidated token lists and token prices from CoinGecko (CMC fallback)
- Shared packages: `types`, `tokenlists`, `evm-connect`, `solana-connect`, `ui`
- State/query: React Query on the client; Redis caches on services
- Telemetry: Pino logs; hooks for OpenTelemetry