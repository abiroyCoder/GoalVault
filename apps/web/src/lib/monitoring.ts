import * as Sentry from "@sentry/react";
import React from "react";

export const monitoring = {
  init: () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (dsn) {
      try {
        Sentry.init({
          dsn,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration(),
          ],
          // Performance Monitoring
          tracesSampleRate: 1.0, 
          tracePropagationTargets: ["localhost"],
          // Session Replay
          replaysSessionSampleRate: 0.1, 
          replaysOnErrorSampleRate: 1.0, 
          environment: import.meta.env.MODE || "development"
        });
        console.log("[Monitoring] Sentry initialized successfully");
      } catch (e) {
        console.warn("Failed to initialize Sentry:", e);
      }
    } else {
      console.log("[Monitoring] Sentry skipped (missing VITE_SENTRY_DSN)");
    }
  },

  captureException: (error: any, context: string = "") => {
    console.error(`[Captured Exception] ${context}:`, error);
    
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (dsn) {
      try {
        Sentry.withScope((scope) => {
          if (context) {
            scope.setTag("context", context);
          }
          Sentry.captureException(error);
        });
      } catch (e) {
        // Graceful fallback
      }
    }
  }
};

interface MonitoringProviderProps {
  children: React.ReactNode;
}

export function MonitoringProvider({ children }: MonitoringProviderProps) {
  return React.createElement(
    Sentry.ErrorBoundary,
    {
      fallback: ({ error, resetError }: { error: any; resetError: (() => void) | undefined }) =>
        React.createElement(
          "div",
          { className: "min-h-screen flex items-center justify-center bg-black/95 text-white p-6" },
          React.createElement(
            "div",
            { className: "max-w-md w-full rounded-2xl border border-rose-500/20 bg-neutral-900 p-6 text-center space-y-4 shadow-2xl" },
            React.createElement(
              "div",
              { className: "h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl" },
              "⚠️"
            ),
            React.createElement(
              "h3",
              { className: "text-lg font-bold text-rose-400" },
              "Application Error"
            ),
            React.createElement(
              "p",
              { className: "text-xs text-neutral-400" },
              "A critical runtime error occurred. The application context has been captured."
            ),
            React.createElement(
              "pre",
              { className: "text-[10px] font-mono bg-black/40 border border-neutral-800 p-3 rounded-xl overflow-auto text-left max-h-32 text-rose-300" },
              error?.message || "Unknown rendering exception"
            ),
            React.createElement(
              "button",
              {
                onClick: () => {
                  if (resetError) resetError();
                  window.location.reload();
                },
                className: "text-xs font-semibold px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors duration-200"
              },
              "Reload Application"
            )
          )
        )
    },
    children
  );
}
