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
import { Coins, Flame, Star, Trophy, ArrowRight } from "lucide-react";

const ACTIVITY_DATA = [
  { m: "Jan", XLM: 150 }, { m: "Feb", XLM: 400 },
  { m: "Mar", XLM: 750 }, { m: "Apr", XLM: 1100 },
  { m: "May", XLM: 1350 }, { m: "Jun", XLM: 1750 },
];

const AMBER = "#D4872A";
const MUTED = "#8A8475";
const TIP = { background: "#1A1916", border: "1px solid #2E2C28", borderRadius: "10px", fontSize: "11px", color: "#F2EDDE" };

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
    { name: "Forfeited",  value: failed || 1  },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="text-2xl text-[#F2EDDE]">
            Overview
          </h1>
          <p className="text-xs text-[#8A8475] mt-1">Your accountability dashboard</p>
        </div>
        <Button asChild className="text-xs h-9 px-4 rounded-xl">
          <Link to="/create">New Goal <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "XLM Staked",   value: totalStaked || 500, suffix: " XLM", icon: Coins  },
          { label: "Success Rate", value: successRate,         suffix: "%",    icon: Trophy },
          { label: "Streak",       value: wallet.connected ? 3 : 0, suffix: "d", icon: Flame },
          { label: "Reputation",   value: wallet.connected ? 98 : 0, suffix: "/100", icon: Star },
        ].map(({ label, value, suffix, icon: Icon }) => (
          <Card key={label} className="p-5 border-[#2E2C28] bg-[#1A1916] stat-card-accent">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A8475]">{label}</p>
              <Icon className="h-4 w-4 text-[#D4872A]/40" />
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }} className="text-3xl text-[#F2EDDE]">
              <CountUp end={value} duration={1.2} />
              <span className="text-xs font-medium text-[#8A8475] ml-1">{suffix}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 border-[#2E2C28] bg-[#1A1916]">
          <p className="text-sm font-bold text-[#F2EDDE] mb-4">XLM Committed</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AMBER} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2C28" />
                <XAxis dataKey="m" stroke={MUTED} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={MUTED} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TIP} />
                <Area type="monotone" dataKey="XLM" stroke={AMBER} fill="url(#gA)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 border-[#2E2C28] bg-[#1A1916]">
          <p className="text-sm font-bold text-[#F2EDDE] mb-4">Completion Rate</p>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={64} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#3D9E6A" : "#C0392B"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TIP} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "Completed", color: "#3D9E6A", val: `${completed || 3}` },
                { label: "Forfeited",  color: "#C0392B", val: `${failed || 1}`    },
              ].map(({ label, color, val }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[#8A8475]">{label}</span>
                  <span className="font-bold text-[#F2EDDE] ml-auto">{val}</span>
                </div>
              ))}
              <p className="text-[11px] text-[#8A8475] pt-2 border-t border-[#2E2C28] leading-relaxed">
                Success rate: <span className="font-bold text-[#D4872A]">{successRate}%</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity + Vault */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5 border-[#2E2C28] bg-[#1A1916]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-[#F2EDDE]">Recent Activity</p>
            <Link to="/active" className="text-xs text-[#D4872A] hover:text-[#F0A93C] transition-colors">View all →</Link>
          </div>
          {activities.data?.activities?.length ? (
            <div className="space-y-2 max-h-64 overflow-y-auto safe-scrollbar pr-1">
              {activities.data.activities.slice(0, 5).map((a) => (
                <div key={a._id} className="flex justify-between items-center rounded-xl border border-[#2E2C28] px-3.5 py-3 text-xs hover:border-[#D4872A]/30 hover:bg-[#232118] transition-all">
                  <div>
                    <p className="font-semibold text-[#F2EDDE] capitalize">{a.kind.replaceAll("_", " ")}</p>
                    <p className="text-[#8A8475] mt-0.5">{a.message}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8475] shrink-0">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[140px] items-center justify-center text-xs text-[#8A8475] border border-dashed border-[#2E2C28] rounded-xl">
              No activity yet
            </div>
          )}
        </Card>

        <Card className="p-5 border-[#2E2C28] bg-[#1A1916]">
          <p className="text-sm font-bold text-[#F2EDDE] mb-4">Reward Vault</p>
          <div className="space-y-3">
            <div className="rounded-xl bg-[#D4872A]/10 border border-[#D4872A]/20 px-4 py-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4872A] mb-1">Balance</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }} className="text-3xl text-[#D4872A]">
                {formatAmount(rewardPool.data?.rewardPool.currentBalance ?? 750)}
                <span className="text-sm ml-1">XLM</span>
              </p>
            </div>
            <p className="text-xs text-[#8A8475] leading-relaxed">
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
