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
    { val: "xp", label: "XP" },
    { val: "staked", label: "Staked" },
    { val: "success-rate", label: "Success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="heading text-xl text-fg">Leaderboard</h2>
        <div className="flex gap-1">
          {scopeTabs.map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setScope(val)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                scope === val ? "border-accent bg-accent/8 text-accent" : "border-border text-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto safe-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-stone-50">
                <th className="py-2.5 px-4 text-[10px] font-bold text-muted uppercase tracking-wider text-center w-12">Rank</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-muted uppercase tracking-wider">User</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-muted uppercase tracking-wider text-center">XP</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-muted uppercase tracking-wider text-center">Staked</th>
                <th className="py-2.5 px-4 text-[10px] font-bold text-muted uppercase tracking-wider text-center">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {leaderboard.isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="h-12">
                    <td colSpan={5} className="px-4"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : list.length > 0 ? (
                list.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold">
                      {row.rank <= 3 ? (
                        <Award className={`h-4 w-4 mx-auto ${row.rank === 1 ? "text-amber-500" : row.rank === 2 ? "text-stone-400" : "text-amber-700"}`} />
                      ) : (
                        <span className="text-muted">{row.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-fg">
                      {row.displayName} <span className="font-mono text-[9px] text-muted ml-1.5">{truncateAddress(row.walletAddress)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {row.xp.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-fg">{row.totalXlmStaked.toLocaleString()} XLM</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="bg-accent/8 border-accent/20 text-accent font-semibold">{row.successRate}%</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
