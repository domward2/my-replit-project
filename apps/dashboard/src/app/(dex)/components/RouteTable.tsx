"use client";
import React from 'react';
import type { AggregatorQuote } from '@dex/types';
import { RouteTable as BaseRouteTable } from '@dex/ui';

export function RouteTable({ quotes, onSelect }: { quotes: AggregatorQuote[]; onSelect: (q: AggregatorQuote) => void }) {
	return <BaseRouteTable quotes={quotes} onSelect={onSelect} />;
}