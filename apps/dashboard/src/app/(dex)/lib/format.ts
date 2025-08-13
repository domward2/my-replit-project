export function formatAmount(amount: string, decimals = 18) {
	try {
		const v = BigInt(amount);
		const base = 10n ** BigInt(decimals);
		const whole = v / base;
		const frac = v % base;
		return `${whole}.${frac.toString().padStart(decimals, '0').slice(0, 4)}`;
	} catch {
		return amount;
	}
}