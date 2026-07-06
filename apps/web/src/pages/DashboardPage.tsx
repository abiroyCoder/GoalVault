import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useWallet } from "../lib/wallet";
import { api } from "../lib/api";
import { formatAmount } from "../lib/utils";
import { Button, Card } from "../components/ui";
import { Coins, Flame, Star, Trophy } from "lucide-react";

const ACTIVITY_DATA = [
  { m: "Jan", XLM: 150 }, { m: "Feb", XLM: 400 },
  { m: "Mar", XLM: 750 }, { m: "Apr", XLM: 1100 },
  { m: "May", XLM: 1350 }, { m: "Jun", XLM: 1750 },
];

const GREEN = "#1A6B3C";
const STONE = "#78716C";
const TIP = { background: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", fontSize: "11px" };

export function DashboardPage() {
  const wallet = useWallet();
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });
  const activities = useQuery({ queryKey: ["activities"], queryFn: api.activities });

  const list = challenges.data?.challenges ?? [];
  const completed = list.filter(c => c.status === "completed").length;
  const failed = list.filter(c => c.status === "failed").length;
  const totalStaked = list.reduce((a, c) => a + c.stakeAmount, 0);
  const successRate = (completed + failed) > 0 ? Math.round(completed / (completed + failed) * 100) : 94;

  const pieData = [
    { name: "Completed", value: completed || 3 },
    { name: "Forfeited", value: failed || 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "XLM Staked",    value: totalStaked || 500, suffix: "XLM", icon: Coins  },
          { label: "Success Rate",  value: successRate,         suffix: "%",   icon: Trophy },
          { label: "Streak",        value: wallet.connected ? 3 : 0, suffix: "d", icon: Flame },
          { label: "Reputation",    value: wallet.connected ? 98 : 0, suffix: "/100", icon: Star },
        ].map(({ label, value, suffix, icon: Icon }) => (
          <Card key={label} className="p-5 stat-card-accent">
            <div className="flex items-center justify-between mb-3">
              <p className="text-label">{label}</p>
              <Icon className="h-4 w-4 text-accent/40" />
            </div>
            <p className="text-3xl font-bold text-fg">
              <CountUp end={value} duration={1.2} />
              <span className="text-xs font-medium text-muted ml-1">{suffix}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm font-semibold text-fg mb-4">XLM Committed</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GREEN} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="m" stroke={STONE} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={STONE} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TIP} />
                <Area type="monotone" dataKey="XLM" stroke={GREEN} fill="url(#gA)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-fg mb-4">Completion Rate</p>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={64} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? GREEN : "#EF4444"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TIP} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "Completed", color: GREEN, val: `${completed || 3}` },
                { label: "Forfeited", color: "#EF4444", val: `${failed || 1}` },
              ].map(({ label, color, val }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-muted">{label}</span>
                  <span className="font-bold text-fg ml-auto">{val}</span>
                </div>
              ))}
              <p className="text-[11px] text-muted pt-2 border-t border-border leading-relaxed">
                Success rate: <span className="font-bold text-accent">{successRate}%</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity + Vault */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-fg">Recent Activity</p>
            <Link to="/active" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          {activities.data?.activities?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto safe-scrollbar pr-1">
              {activities.data.activities.slice(0, 5).map((a) => (
                <div key={a._id} className="flex justify-between items-center rounded-lg border border-border px-3.5 py-3 text-xs hover:border-accent/30 transition-colors">
                  <div>
                    <p className="font-semibold text-fg capitalize">{a.kind.replaceAll("_", " ")}</p>
                    <p className="text-muted mt-0.5">{a.message}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[140px] items-center justify-center text-xs text-muted border border-dashed border-border rounded-xl">
              No activity yet
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-fg mb-4">Reward Vault</p>
          <div className="space-y-3">
            <div className="rounded-lg bg-stone-50 border border-border px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-muted">Balance</span>
              <span className="text-sm font-bold text-accent">
                {formatAmount(rewardPool.data?.rewardPool.currentBalance ?? 750)} XLM
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Funded by forfeited goal stakes. Distributed to active verifiers.
            </p>
            <Button asChild variant="secondary" className="w-full text-xs rounded-xl h-9">
              <Link to="/reward-pool">View Vault</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
