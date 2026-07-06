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
          { className: "min-h-screen flex items-center justify-center bg-[#F4F1EA] text-[#1C1C1A] p-6" },
          React.createElement(
            "div",
            { className: "max-w-md w-full rounded-2xl border border-red-200 bg-[#FAF8F4] p-6 text-center space-y-4 shadow-soft" },
            React.createElement(
              "div",
              { className: "h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-lg" },
              "⚠️"
            ),
            React.createElement(
              "h3",
              { className: "text-base font-bold text-fg" },
              "Application Error"
            ),
            React.createElement(
              "p",
              { className: "text-xs text-muted" },
              "A critical runtime exception occurred. The incident context has been recorded."
            ),
            React.createElement(
              "pre",
              { className: "text-[10px] font-mono bg-stone-50 border border-border p-3 rounded-xl overflow-auto text-left max-h-32 text-red-600" },
              error?.message || "Unknown rendering exception"
            ),
            React.createElement(
              "button",
              {
                onClick: () => {
                  if (resetError) resetError();
                  window.location.reload();
                },
                className: "text-xs font-semibold px-4 py-2 bg-accent text-white rounded-xl hover:bg-[#155730] transition-colors"
              },
              "Reload Application"
            )
          )
        )
    },
    children
  );
}
