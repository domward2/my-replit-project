import React from 'react';
import type { AggregatorQuote } from '@dex/types';

export function RouteTable({ quotes, onSelect }: { quotes: AggregatorQuote[]; onSelect: (q: AggregatorQuote) => void }) {
	return (
		<table className="min-w-full border mt-4">
			<thead>
				<tr className="bg-gray-50">
					<th className="p-2 text-left">Aggregator</th>
					<th className="p-2 text-left">Amount Out</th>
					<th className="p-2 text-left">Gas (native)</th>
					<th className="p-2 text-left">Action</th>
				</tr>
			</thead>
			<tbody>
				{quotes.map((q, idx) => (
					<tr key={idx} className="border-t">
						<td className="p-2">{q.aggregator}</td>
						<td className="p-2">{q.amountOut}</td>
						<td className="p-2">{q.gasEstimateNative ?? '-'}</td>
						<td className="p-2">
							<button className="border rounded px-3 py-1" onClick={() => onSelect(q)}>Select</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}