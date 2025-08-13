import React from 'react';

const CHAINS = ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'bsc', 'avalanche', 'solana'] as const;

type Chain = typeof CHAINS[number];

export function ChainSelector({ value, onChange }: { value?: Chain; onChange: (chain: Chain) => void }) {
	return (
		<select className="border rounded p-2" value={value} onChange={(e) => onChange(e.target.value as Chain)}>
			<option value="">Select chain</option>
			{CHAINS.map((c) => (
				<option key={c} value={c}>
					{c}
				</option>
			))}
		</select>
	);
}