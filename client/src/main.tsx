import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";

// Initialize Sentry
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
  console.log('Sentry initialized successfully');
} else {
  console.warn('Sentry DSN not found. Error tracking disabled.');
}

createRoot(document.getElementById("root")!).render(<App />);
