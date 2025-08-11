import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const baseUrl = getAPIBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  // Get auth token from localStorage
  const token = localStorage.getItem('pnl-ai-token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.text();
    let errorMessage;

    try {
      const parsed = JSON.parse(errorData);
      errorMessage = parsed.message || `HTTP ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}