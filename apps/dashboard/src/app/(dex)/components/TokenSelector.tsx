"use client";
import React from 'react';
import { TokenSelector as BaseTokenSelector } from '@dex/ui';

type Token = { address: string; symbol: string };

export function TokenSelector({ tokens, value, onChange }: { tokens: Token[]; value?: string; onChange: (v: string) => void }) {
	return <BaseTokenSelector tokens={tokens} value={value} onChange={onChange} />;
}