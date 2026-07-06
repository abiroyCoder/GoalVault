import { Bell, ShieldCheck, Trophy, Info } from "lucide-react";
import { Card } from "../components/ui";
import { useDappStore } from "../lib/store";

function NotificationsList() {
  const notifications = useDappStore((state) => state.notifications);

  const getIcon = (kind: string) => {
    switch (kind) {
      case "challenge_created":
        return <Trophy className="h-4 w-4 text-accent" />;
      case "proof_approved":
        return <ShieldCheck className="h-4 w-4 text-accent" />;
      default:
        return <Info className="h-4 w-4 text-muted" />;
    }
  };

  return notifications.length > 0 ? (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className="flex gap-3.5 p-4 border border-border rounded-xl hover:border-accent/30 hover:bg-stone-50 transition-all duration-150"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-stone-50 shrink-0">
            {getIcon(notif.kind)}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-fg">{notif.title}</h4>
            <p className="text-xs text-muted leading-relaxed mt-0.5">{notif.body}</p>
          </div>
          <span className="text-[10px] text-muted font-mono whitespace-nowrap">
            {new Date(notif.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-14">
      <Bell className="h-8 w-8 text-muted/40 mx-auto mb-3" />
      <p className="text-xs font-semibold text-fg">No alerts</p>
      <p className="text-[11px] text-muted mt-1">
        Goal milestones and verification results will appear here.
      </p>
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div className="space-y-7">
      <div className="border-b border-border pb-5">
        <p className="text-label mb-1">GoalVault</p>
        <h2 className="heading text-2xl text-fg flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          Alerts
        </h2>
        <p className="text-sm text-muted mt-1">Goal milestones, proof verification results, and vault payouts.</p>
      </div>
      <Card className="p-5">
        <NotificationsList />
      </Card>
    </div>
  );
}
