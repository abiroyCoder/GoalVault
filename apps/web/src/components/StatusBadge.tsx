import { useMemo } from "react";
import { ShieldCheck, Star, Zap, Award, Flame } from "lucide-react";

export interface BadgeConfig {
  label: string;
  description: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  minGoals: number;
}

/** Ordered tier list — first match wins. */
export const BADGE_TIERS: BadgeConfig[] = [
  {
    label: "Legend",
    description: "An unstoppable force — completed 20+ goals",
    color: "#b45309",
    bg: "#fef3c7",
    icon: Award,
    minGoals: 20,
  },
  {
    label: "Champion",
    description: "Elite accountability — completed 10+ goals",
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: Flame,
    minGoals: 10,
  },
  {
    label: "Pro",
    description: "Consistent performer — completed 5+ goals",
    color: "#1A6B3C",
    bg: "#dcfce7",
    icon: Star,
    minGoals: 5,
  },
  {
    label: "Builder",
    description: "Making progress — completed 2+ goals",
    color: "#0369a1",
    bg: "#e0f2fe",
    icon: Zap,
    minGoals: 2,
  },
  {
    label: "Novice",
    description: "Just getting started",
    color: "#71717a",
    bg: "#f4f4f5",
    icon: ShieldCheck,
    minGoals: 0,
  },
];

/** Returns the appropriate badge tier for a given completed goal count. */
export function getBadge(completedGoals: number): BadgeConfig {
  return (
    BADGE_TIERS.find(tier => completedGoals >= tier.minGoals) ??
    BADGE_TIERS[BADGE_TIERS.length - 1]
  ) as BadgeConfig;
}

interface StatusBadgeProps {
  completedGoals: number;
  /** Show inline (small chip) or full card layout */
  variant?: "chip" | "card";
  className?: string;
}

/** Renders a user's earned status badge based on completed goal count. */
export function StatusBadge({ completedGoals, variant = "chip", className = "" }: StatusBadgeProps) {
  const badge = useMemo(() => getBadge(completedGoals), [completedGoals]);
  const Icon = badge.icon;

  if (variant === "card") {
    return (
      <div
        id="status-badge-card"
        className={`rounded-xl p-4 flex items-center gap-4 border ${className}`}
        style={{ background: badge.bg, borderColor: badge.color + "33" }}
      >
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: badge.color + "22" }}
        >
          <Icon className="h-6 w-6" style={{ color: badge.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">{badge.description}</p>
          <p className="text-xs font-medium mt-1" style={{ color: badge.color }}>
            {completedGoals} goal{completedGoals !== 1 ? "s" : ""} completed
          </p>
        </div>
      </div>
    );
  }

  // chip variant
  return (
    <span
      id="status-badge-chip"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{ background: badge.bg, color: badge.color }}
    >
      <Icon className="h-3 w-3" />
      {badge.label}
    </span>
  );
}
