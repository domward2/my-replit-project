import React from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';

interface SentryErrorFallbackProps {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

function ErrorFallback({ error, resetError }: SentryErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return (
    <div 
      role="alert" 
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"
      data-testid="error-fallback"
    >
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
        <p className="text-gray-300">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <details className="text-sm text-gray-400 bg-gray-800 p-3 rounded">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{errorMessage}</pre>
        </details>
        <div className="space-x-2">
          <Button 
            onClick={resetError} 
            variant="outline"
            data-testid="button-retry"
          >
            Try again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            data-testid="button-home"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  },
  {
    fallback: ErrorFallback,
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('errorBoundary', true);
      scope.setLevel('error');
      scope.setContext('errorInfo', errorInfo);
    },
  }
);