import React from 'react';

type Token = { address: string; symbol: string };

export function TokenSelector({ tokens, value, onChange }: { tokens: Token[]; value?: string; onChange: (address: string) => void }) {
	return (
		<select className="border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
			<option value="">Select token</option>
			{tokens.map((t) => (
				<option key={t.address} value={t.address}>
					{t.symbol}
				</option>
			))}
		</select>
	);
}