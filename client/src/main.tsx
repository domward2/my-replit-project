import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";

// Initialize Sentry
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn && sentryDsn.startsWith('https://')) {
  try {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out development errors in production
        if (import.meta.env.PROD && event.message?.includes('development')) {
          return null;
        }
        return event;
      },
    });
    if (import.meta.env.DEV) {
      console.log('Sentry initialized successfully');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Sentry initialization failed:', error);
    }
  }
} else {
  if (import.meta.env.DEV) {
    console.warn('Sentry DSN not found or invalid format. Error tracking disabled.');
  }
}

createRoot(document.getElementById("root")!).render(<App />);
