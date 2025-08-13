"use client";
import React from 'react';
import { SlippageControl as BaseSlippageControl } from '@dex/ui';

export function SlippageControl({ valueBps, onChange }: { valueBps: number; onChange: (v: number) => void }) {
	return <BaseSlippageControl valueBps={valueBps} onChange={onChange} />;
}