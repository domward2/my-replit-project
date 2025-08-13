export async function fetchWithTimeout(resource: string, init: RequestInit & { timeoutMs?: number } = {}) {
	const { timeoutMs = 8000, ...rest } = init;
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(resource, { ...rest, signal: controller.signal });
		return res;
	} finally {
		clearTimeout(id);
	}
}