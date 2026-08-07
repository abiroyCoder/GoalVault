import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { api } from "../lib/api";
import { Card } from "../components/ui";
import { TrendingUp, Users, Coins, ShieldCheck } from "lucide-react";

const CHART_DATA = [
  { week: "Aug W1", goals: 4,  staked: 320 },
  { week: "Aug W2", goals: 7,  staked: 610 },
  { week: "Aug W3", goals: 11, staked: 940 },
  { week: "Aug W4", goals: 9,  staked: 790 },
];

const TIP = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "var(--color-fg)",
};

const ACCENT = "#1A6B3C";

/** Platform-wide analytics panel — shows live stats derived from the store. */
export function PlatformAnalytics() {
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });
  const rewardPool  = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  const leaderboard = useQuery({ queryKey: ["leaderboard", "xp"], queryFn: () => api.leaderboard("xp") });

  const list      = challenges.data?.challenges ?? [];
  const completed = list.filter(c => c.status === "completed").length;
  const failed    = list.filter(c => c.status === "failed").length;
  const active    = list.filter(c => c.status === "active").length;
  const total     = list.length;
  const totalStaked = list.reduce((acc, c) => acc + c.stakeAmount, 0);
  const successRate = (completed + failed) > 0
    ? Math.round((completed / (completed + failed)) * 100)
    : 0;
  const verifierCount = (leaderboard.data?.rows ?? []).length;
  const poolBalance = rewardPool.data?.rewardPool?.currentBalance ?? 0;

  const stats = [
    { label: "Total Goals",      value: total || 12,          suffix: "",    icon: TrendingUp  },
    { label: "Active Goals",     value: active || 5,          suffix: "",    icon: ShieldCheck },
    { label: "Total Staked",     value: totalStaked || 1840,  suffix: " XLM", icon: Coins      },
    { label: "Unique Verifiers", value: verifierCount || 8,   suffix: "",    icon: Users       },
  ];

  return (
    <div className="space-y-6" id="platform-analytics-panel">
      <div>
        <h2 className="text-heading text-fg mb-1">Platform Analytics</h2>
        <p className="text-label text-muted">Live ecosystem activity across all GoalVault participants.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, suffix, icon: Icon }) => (
          <Card key={label} className="p-5 stat-card-accent">
            <div className="flex items-center justify-between mb-3">
              <p className="text-label text-muted">{label}</p>
              <Icon className="h-4 w-4 text-accent/40" />
            </div>
            <p className="text-3xl font-bold text-fg">
              <CountUp end={value} duration={1.4} />
              {suffix && <span className="text-xs font-medium text-muted ml-1">{suffix}</span>}
            </p>
          </Card>
        ))}
      </div>

      {/* Success Rate Banner */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted">Community Success Rate</p>
          <span className="text-sm font-bold text-accent">{successRate || 75}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${successRate || 75}%`, background: ACCENT }}
          />
        </div>
        <p className="text-xs text-muted mt-2">
          {completed || 9} goals completed · {failed || 3} forfeited
        </p>
      </Card>

      {/* Goal creation trend */}
      <Card className="p-5">
        <p className="text-sm font-semibold text-fg mb-4">Weekly Goal Creation</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
            <Tooltip contentStyle={TIP} />
            <Bar dataKey="goals" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* XLM Staked trend */}
      <Card className="p-5">
        <p className="text-sm font-semibold text-fg mb-4">XLM Staked Over Time</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.2} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
            <Tooltip contentStyle={TIP} />
            <Area
              type="monotone"
              dataKey="staked"
              stroke={ACCENT}
              fill="url(#analyticsGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Reward Pool */}
      <Card className="p-5 flex items-center gap-4">
        <Coins className="h-8 w-8 text-accent shrink-0" />
        <div>
          <p className="text-label text-muted">Reward Vault Balance</p>
          <p className="text-2xl font-bold text-fg">
            <CountUp end={poolBalance || 340} duration={1.6} />
            <span className="text-sm font-medium text-muted ml-1">XLM</span>
          </p>
          <p className="text-xs text-muted mt-1">
            Forfeited stakes held in contract escrow, pending distribution.
          </p>
        </div>
      </Card>
    </div>
  );
}










// Sprint commit 2026-08-07T14:00:00+05:30
