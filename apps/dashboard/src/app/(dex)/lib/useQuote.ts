"use client";
import { useQuery } from '@tanstack/react-query';
import { getQuotes } from './api';

export function useQuote(params: any, enabled: boolean) {
	return useQuery({
		queryKey: ['quotes', params],
		queryFn: () => getQuotes(params),
		enabled,
		refetchInterval: 15000,
	});
}