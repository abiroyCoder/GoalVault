import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Trophy, BarChart3, Award, Star } from "lucide-react";
import { truncateAddress } from "../lib/utils";

export function LeaderboardPage() {
  const [scope, setScope] = useState<"xp" | "staked" | "success-rate">("xp");

  const leaderboard = useQuery({
    queryKey: ["leaderboard", scope],
    queryFn: () => api.leaderboard(scope),
  });

  const list = leaderboard.data?.rows ?? [];

  const scopeTabs: { val: typeof scope; label: string }[] = [
    { val: "xp",           label: "XP"      },
    { val: "staked",       label: "Staked"  },
    { val: "success-rate", label: "Success" },
  ];

  const rankStyle = (rank: number) => {
    if (rank === 1) return "text-[#F0A93C]";
    if (rank === 2) return "text-[#8A8475]";
    if (rank === 3) return "text-[#a0522d]";
    return "text-[#8A8475]";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#2E2C28] pb-4">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="text-2xl text-[#F2EDDE]">Rankings</h1>
          <p className="text-xs text-[#8A8475] mt-1">Top performers by goal completion</p>
        </div>
        <div className="flex gap-1.5">
          {scopeTabs.map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setScope(val)}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                scope === val
                  ? "border-[#D4872A]/40 bg-[#D4872A]/12 text-[#D4872A]"
                  : "border-[#2E2C28] text-[#8A8475] hover:text-[#F2EDDE] hover:bg-[#232118]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden p-0 border-[#2E2C28] bg-[#1A1916]">
        <div className="overflow-x-auto safe-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2E2C28] bg-[#232118]">
                <th className="py-3 px-4 text-[10px] font-bold text-[#8A8475] uppercase tracking-wider text-center w-12">Rank</th>
                <th className="py-3 px-4 text-[10px] font-bold text-[#8A8475] uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-[10px] font-bold text-[#8A8475] uppercase tracking-wider text-center">XP</th>
                <th className="py-3 px-4 text-[10px] font-bold text-[#8A8475] uppercase tracking-wider text-center">Staked</th>
                <th className="py-3 px-4 text-[10px] font-bold text-[#8A8475] uppercase tracking-wider text-center">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2C28] text-xs">
              {leaderboard.isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="h-12">
                    <td colSpan={5} className="px-4"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : list.length > 0 ? (
                list.map((row: any, idx: number) => (
                  <tr key={idx} className={`hover:bg-[#232118] transition-colors ${idx < 3 ? "border-l-2" : ""}`}
                    style={{ borderLeftColor: idx === 0 ? "#F0A93C" : idx === 1 ? "#8A8475" : idx === 2 ? "#a0522d" : "transparent" }}>
                    <td className="py-3.5 px-4 text-center font-bold">
                      {row.rank <= 3 ? (
                        <Award className={`h-4 w-4 mx-auto ${rankStyle(row.rank)}`} />
                      ) : (
                        <span className="text-[#8A8475]">{row.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#F2EDDE]">
                      {row.displayName}{" "}
                      <span className="font-mono text-[9px] text-[#8A8475] ml-1.5">{truncateAddress(row.walletAddress)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-[#F2EDDE] inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-[#D4872A] fill-[#D4872A]" />
                        {row.xp.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#F2EDDE]">{row.totalXlmStaked.toLocaleString()} XLM</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-[#3D9E6A]/10 border-[#3D9E6A]/25 text-[#3D9E6A]">{row.successRate}%</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <BarChart3 className="h-8 w-8 text-[#2E2C28] mx-auto mb-2" />
                    <p className="text-sm text-[#8A8475]">No rankings yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
