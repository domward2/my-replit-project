import React from 'react';

export function SlippageControl({ valueBps, onChange }: { valueBps: number; onChange: (bps: number) => void }) {
	return (
		<label className="inline-flex items-center gap-2">
			<span>Slippage (bps):</span>
			<input
				type="number"
				className="border rounded p-2 w-24"
				value={valueBps}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
				min={0}
			/>
		</label>
	);
}