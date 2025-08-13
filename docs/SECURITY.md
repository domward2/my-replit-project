### Security Overview

- Non-custodial UI; all transactions are constructed server-side and signed client-side.
- No private keys on servers; services only return calldata or serialized transactions.
- Input validation via Zod on all endpoints.
- CORS restricted to dashboard origin.
- Redis caching with short TTLs; no sensitive data stored.
- Aggregator timeouts and error isolation to avoid cascading failures.
- Future: add OpenAPI schemas and request/response validation at the edge.