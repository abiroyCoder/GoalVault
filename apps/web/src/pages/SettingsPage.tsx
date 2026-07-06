import { useDappStore } from "../lib/store";
import { useTheme } from "../lib/theme";
import { Card, Button, Badge } from "../components/ui";
import { Settings, RefreshCw, Sun, Moon, Database } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const { themeMode, setThemeMode } = useTheme();
  const { setOnboardingCompleted } = useDappStore();

  const handleResetTour = () => {
    setOnboardingCompleted(false);
    toast.success("Onboarding tour reset. Refresh the page or go to Dashboard to start the tour.");
  };

  const handleClearCache = () => {
    localStorage.removeItem("skillstake_dapp_storage");
    toast.success("Local storage cache purged. Re-initializing app...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent dark:text-white" />
          Settings Panel
        </h2>
        <p className="text-sm text-muted">Adjust system aesthetics and reset onboarding walkthrough guides.</p>
      </div>

      <div className="space-y-6" id="tour-step-settings">
        {/* Theme Settings */}
        <Card className="p-6 border-border/80 space-y-4">
          <div>
            <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-2">
              <Sun className="h-4.5 w-4.5 text-muted" />
              Theme Appearance
            </h3>
            <p className="text-xs text-muted">Aesthetic control flags of the application dashboard.</p>
          </div>

          <div className="grid gap-3 grid-cols-2 pt-2">
            {(["light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-bold capitalize transition-all duration-200 ${
                  themeMode === mode
                    ? "border-accent bg-accent/5 text-accent dark:text-white"
                    : "border-border hover:border-accent/40 bg-transparent text-muted"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-muted" />
              Onboarding Configuration
            </h3>
            <p className="text-xs text-muted">Restart walkthrough guides and reset tutorial markers.</p>
          </div>

          <div className="pt-2">
            <Button onClick={handleResetTour} variant="secondary" className="w-full text-xs h-10 font-bold rounded-xl flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset Onboarding Tour
            </Button>
          </div>
        </Card>

        {/* Database Clear */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-muted" />
              Developer Cache Options
            </h3>
            <p className="text-xs text-muted">Purge cached mock logs, achievements badges, and stored telemetry.</p>
          </div>

          <div className="pt-2">
            <Button onClick={handleClearCache} variant="secondary" className="w-full text-rose-500 border-rose-500/20 hover:bg-rose-500/5 text-xs h-10 font-bold rounded-xl flex items-center justify-center gap-2">
              <Database className="h-4 w-4" />
              Purge Local Storage Cache
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
