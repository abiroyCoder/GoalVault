import { useEffect } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { queryClient } from "./lib/query";
import { ThemeProvider } from "./lib/theme";
import { api } from "./lib/api";
import { AppShell } from "./layout";
import { useWallet } from "./lib/wallet";
import { MonitoringProvider } from "./lib/monitoring";
import { Analytics } from "@vercel/analytics/react";
import {
  ActiveChallengesPage,
  AdminDashboardPage,
  ChallengeDetailsPage,
  CreateChallengePage,
  DashboardPage,
  LandingPage,
  LeaderboardPage,
  NotFoundPage,
  NotificationsPage,
  ProfilePage,
  RewardPoolPage,
  SettingsPage,
  WalletPage,
  LivePage,
  UserValidationPage,
} from "./pages";

function AppNetworkGuard() {
  useQuery({ queryKey: ["network"], queryFn: api.network });
  return null;
}

export function App() {
  const wallet = useWallet();

  useEffect(() => {
    wallet.initializeSession();
  }, []);

  return (
    <MonitoringProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AppNetworkGuard />
            <Routes>
              {/* ── Standalone landing — no app shell ── */}
              <Route path="/" element={<LandingPage />} />

              {/* ── App shell with top-center navbar wraps all dashboard routes ── */}
              <Route
                path="/*"
                element={
                  <AppShell>
                    <Routes>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/live" element={<LivePage />} />
                      <Route path="/wallet" element={<WalletPage />} />
                      <Route path="/create" element={<CreateChallengePage />} />
                      <Route path="/challenge/:id" element={<ChallengeDetailsPage />} />
                      <Route path="/active" element={<ActiveChallengesPage />} />
                      <Route path="/completed" element={<ActiveChallengesPage completedOnly />} />
                      <Route path="/reward-pool" element={<RewardPoolPage />} />
                      <Route path="/leaderboard" element={<LeaderboardPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/validation" element={<UserValidationPage />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </AppShell>
                }
              />
            </Routes>
            <Toaster position="bottom-right" richColors closeButton />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      <Analytics />
    </MonitoringProvider>
  );
}
