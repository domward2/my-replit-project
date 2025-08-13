"use client";
import React from 'react';

export default function SwapButton({ onClick }: { onClick: () => void }) {
	return (
		<button className="bg-blue-600 text-white rounded px-4 py-2" onClick={onClick}>
			Swap
		</button>
	);
}