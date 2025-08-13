"use client";
import React from 'react';
import { ChainSelector as BaseChainSelector } from '@dex/ui';

export function ChainSelector({ value, onChange }: { value?: any; onChange: (v: any) => void }) {
	return <BaseChainSelector value={value} onChange={onChange} />;
}