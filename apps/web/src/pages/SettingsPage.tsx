import { useDappStore } from "../lib/store";
import { useTheme } from "../lib/theme";
import { Card, Button } from "../components/ui";
import { Settings, RefreshCw, Database } from "lucide-react";
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
    setTimeout(() => { window.location.reload(); }, 1000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-[#2E2C28] pb-5">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          className="text-2xl text-[#F2EDDE] flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#D4872A]" />
          Settings
        </h1>
        <p className="text-sm text-[#8A8475] mt-1">Adjust system preferences and reset onboarding guides.</p>
      </div>

      <div className="space-y-5" id="tour-step-settings">
        {/* Theme */}
        <Card className="p-6 border-[#2E2C28] bg-[#1A1916] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F2EDDE]">Theme Appearance</h3>
            <p className="text-xs text-[#8A8475]">Aesthetic control flags of the application dashboard.</p>
          </div>
          <div className="grid gap-3 grid-cols-2 pt-2">
            {(["light", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-bold capitalize transition-all duration-200 ${
                  themeMode === mode
                    ? "border-[#D4872A]/40 bg-[#D4872A]/12 text-[#D4872A]"
                    : "border-[#2E2C28] text-[#8A8475] hover:border-[#D4872A]/30 hover:text-[#F2EDDE] hover:bg-[#232118]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </Card>

        {/* Onboarding */}
        <Card className="p-6 border-[#2E2C28] bg-[#1A1916] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F2EDDE] flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#8A8475]" />
              Onboarding Configuration
            </h3>
            <p className="text-xs text-[#8A8475]">Restart walkthrough guides and reset tutorial markers.</p>
          </div>
          <Button onClick={handleResetTour} variant="secondary" className="w-full text-xs h-10 font-bold rounded-xl">
            <RefreshCw className="h-4 w-4" />
            Reset Onboarding Tour
          </Button>
        </Card>

        {/* Cache */}
        <Card className="p-6 border-[#2E2C28] bg-[#1A1916] space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#F2EDDE] flex items-center gap-2">
              <Database className="h-4 w-4 text-[#8A8475]" />
              Developer Cache Options
            </h3>
            <p className="text-xs text-[#8A8475]">Purge cached mock logs, achievements badges, and stored telemetry.</p>
          </div>
          <Button onClick={handleClearCache} variant="danger" className="w-full text-xs h-10 font-bold rounded-xl">
            <Database className="h-4 w-4" />
            Purge Local Storage Cache
          </Button>
        </Card>
      </div>
    </div>
  );
}
