"use client";
import React from 'react';

export function TxStatus({ hash, explorerUrl }: { hash?: string; explorerUrl?: string }) {
	if (!hash) return null;
	return (
		<div className="p-3 border rounded">
			<div>Tx: {hash}</div>
			{explorerUrl && (
				<a className="text-blue-600 underline" href={explorerUrl} target="_blank" rel="noreferrer">
					View on Explorer
				</a>
			)}
		</div>
	);
}