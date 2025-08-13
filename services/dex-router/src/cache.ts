import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

export async function cacheGet<T>(key: string): Promise<T | null> {
	const val = await redis.get(key);
	return val ? (JSON.parse(val) as T) : null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
	await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export { redis };