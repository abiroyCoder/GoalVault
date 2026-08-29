import { Bell, ShieldCheck, Trophy, Info } from "lucide-react";
import { Card } from "../components/ui";
import { useDappStore } from "../lib/store";

function NotificationsList() {
  const notifications = useDappStore((state) => state.notifications);

  const getIcon = (kind: string) => {
    switch (kind) {
      case "challenge_created": return <Trophy className="h-4 w-4 text-[#D4872A]" />;
      case "proof_approved":   return <ShieldCheck className="h-4 w-4 text-[#3D9E6A]" />;
      default:                  return <Info className="h-4 w-4 text-[#8A8475]" />;
    }
  };

  return notifications.length > 0 ? (
    <div className="space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif._id}
          className="flex gap-3.5 p-4 border border-[#2E2C28] rounded-xl hover:border-[#D4872A]/25 hover:bg-[#232118] transition-all duration-150"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2E2C28] bg-[#232118] shrink-0">
            {getIcon(notif.kind)}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-[#F2EDDE]">{notif.title}</h4>
            <p className="text-xs text-[#8A8475] leading-relaxed mt-0.5">{notif.body}</p>
          </div>
          <span className="text-[10px] text-[#8A8475] font-mono whitespace-nowrap">
            {new Date(notif.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-14">
      <Bell className="h-8 w-8 text-[#2E2C28] mx-auto mb-3" />
      <p className="text-xs font-semibold text-[#F2EDDE]">No alerts</p>
      <p className="text-[11px] text-[#8A8475] mt-1">
        Goal milestones and verification results will appear here.
      </p>
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div className="space-y-7">
      <div className="border-b border-[#2E2C28] pb-5">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          className="text-2xl text-[#F2EDDE] flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#D4872A]" />
          Alerts
        </h1>
        <p className="text-sm text-[#8A8475] mt-1">Goal milestones, proof verification results, and vault payouts.</p>
      </div>
      <Card className="p-5 border-[#2E2C28] bg-[#1A1916]">
        <NotificationsList />
      </Card>
    </div>
  );
}
