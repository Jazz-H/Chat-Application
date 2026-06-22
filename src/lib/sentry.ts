import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry error monitoring. No-ops unless a DSN is provided via the
 * VITE_SENTRY_DSN environment variable, so local/dev builds stay quiet.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });
}
