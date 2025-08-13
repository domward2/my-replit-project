"use client";
import React from 'react';

export default function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	return (
		<input
			type="text"
			inputMode="decimal"
			placeholder="0.0"
			className="border rounded p-2 w-40"
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}