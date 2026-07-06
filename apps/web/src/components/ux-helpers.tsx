import { type ReactNode, useEffect, Component } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Share2, Clipboard, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { Button, Card } from "./ui";
import { toast } from "sonner";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  txHash?: string;
  explorerUrl?: string;
}

export function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ffffff"]
  });
}

export function SuccessModal({ isOpen, onClose, title, message, txHash, explorerUrl }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  const copyHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      toast.success("Transaction Hash copied to clipboard");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md z-10"
          >
            <Card className="p-6 border-emerald-500/30 bg-card shadow-2xl relative overflow-hidden">
              {/* Confetti decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close success modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-accent dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-muted mb-5 leading-relaxed">{message}</p>

              {txHash && (
                <div className="mb-5 rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] p-3 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                    <span>Transaction Hash</span>
                    <button onClick={copyHash} className="hover:text-fg flex items-center gap-1 transition-colors">
                      <Clipboard className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="font-mono text-fg break-all font-medium select-all">{txHash}</p>
                </div>
              )}

              <div className="flex gap-3">
                {explorerUrl && (
                  <Button asChild variant="secondary" className="flex-1 text-xs">
                    <a href={explorerUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5">
                      View Explorer
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
                <Button onClick={onClose} className="flex-1 text-xs font-semibold">
                  Dismiss
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-current ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SentryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Dynamic Sentry invocation is configured globally
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <Card className="m-6 border-rose-500/20 bg-rose-500/5 p-6 text-center max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-rose-500 mb-2">Something went wrong</h2>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred in the React runtime."}
          </p>
          <Button onClick={() => window.location.reload()} className="text-xs">
            Reload Application
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
