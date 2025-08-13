# DEX Monorepo

Monorepo with Next.js dashboard, dex-router and price-service, and shared packages.

## Prerequisites
- Node 20+
- pnpm 8+
- Docker (for Redis)

## Getting Started
1. Install deps
```
pnpm install
```
2. Start Redis
```
docker compose up -d
```
3. Dev servers
```
pnpm dev
```
- Dashboard: http://localhost:3000
- dex-router: http://localhost:4001/health
- price-service: http://localhost:4002/health

Copy `.env.example` to `.env` in root and set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

## Workspace
- apps/dashboard
- services/dex-router
- services/price-service
- packages/* (types, ui, tokenlists, evm-connect, solana-connect)