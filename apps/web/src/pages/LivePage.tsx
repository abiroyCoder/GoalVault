import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Sparkles, Activity, ShieldCheck, Trophy, XCircle, Clock } from "lucide-react";

export function LivePage() {
  const activities = useQuery({
    queryKey: ["activities"],
    queryFn: api.activities,
    refetchInterval: 5000 // poll every 5 seconds to feel live
  });

  const getIcon = (kind: string) => {
    switch (kind) {
      case "challenge_created":
        return <Trophy className="h-4.5 w-4.5 text-blue-500" />;
      case "proof_submitted":
        return <Clock className="h-4.5 w-4.5 text-amber-500" />;
      case "proof_approved":
        return <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />;
      case "proof_rejected":
        return <XCircle className="h-4.5 w-4.5 text-rose-500" />;
      default:
        return <Activity className="h-4.5 w-4.5 text-muted" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-accent dark:text-white" />
          Live accountability feed
        </h2>
        <p className="text-sm text-muted">Real-time Soroban events, verification voting updates, and reward pool releases.</p>
      </div>

      {/* Main Feed Container */}
      <Card className="p-6 border-border/80" id="tour-step-live-feed">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Live telemetry feed</span>
          </div>
          <Badge className="bg-black/5 dark:bg-white/5 border-border">Auto-refreshes</Badge>
        </div>

        {activities.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : activities.data?.activities && activities.data.activities.length > 0 ? (
          <div className="space-y-4">
            {activities.data.activities.map((activity, idx) => (
              <div
                key={activity._id || idx}
                className="flex items-start gap-4 p-4 border border-border/60 rounded-2xl hover:bg-black/[0.01] dark:hover:bg-white/[0.005] hover:border-border transition-all duration-200"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm">
                  {getIcon(activity.kind)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-accent dark:text-white capitalize">
                      {activity.kind.replaceAll("_", " ")}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{truncateAddr(activity.actorAddress)}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{activity.message}</p>
                </div>
                <div className="text-[10px] text-muted font-mono whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <Sparkles className="h-8 w-8 text-muted/60 mx-auto mb-2" />
            <p className="text-xs font-semibold text-accent dark:text-white">Waiting for activity signals...</p>
            <p className="text-[11px] text-muted mt-1">Actions taken across the app will update this dashboard instantly.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function truncateAddr(addr: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
