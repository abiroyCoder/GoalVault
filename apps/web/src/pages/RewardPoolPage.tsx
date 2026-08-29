import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Coins, Trophy, ShieldCheck } from "lucide-react";
import { formatAmount, truncateAddress } from "../lib/utils";

export function RewardPoolPage() {
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });

  const pool = rewardPool.data?.rewardPool ?? {
    currentBalance: 750,
    historicalDistributions: [],
    topContributors: [],
    topEarners: [],
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#2E2C28] pb-4">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          className="text-2xl text-[#F2EDDE]">Reward Vault</h1>
        <p className="text-xs text-[#8A8475] mt-1">Forfeited stakes redistributed to active verifiers</p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1fr_1.3fr]">
        {/* Balance Hero */}
        <Card className="p-6 flex flex-col justify-between border-[#2E2C28] bg-[#1A1916] relative overflow-hidden">
          {/* Amber glow orb */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#D4872A]/8 blur-2xl pointer-events-none" />
          <div className="relative">
            <Badge className="bg-[#D4872A]/10 border-[#D4872A]/25 text-[#D4872A]">Treasury</Badge>
            <h3 className="mt-2 text-sm font-semibold text-[#F2EDDE]">Active Vault</h3>
          </div>
          <div className="my-6 text-center relative">
            {rewardPool.isLoading ? (
              <Skeleton className="h-14 w-40 mx-auto bg-[#2E2C28]" />
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A8475] mb-2">Balance</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.03em" }}
                  className="text-5xl text-[#D4872A] flex items-baseline justify-center gap-2">
                  {formatAmount(pool.currentBalance)}
                  <span className="text-lg font-semibold text-[#8A8475]">XLM</span>
                </p>
              </>
            )}
          </div>
          <p className="text-xs text-[#8A8475] leading-relaxed relative">
            Funded by forfeited stakes. Automatically distributed to active verifiers.
          </p>
        </Card>

        {/* Top Contributors / Earners */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {[
            { title: "Top Contributors", icon: Coins, data: pool.topContributors, valueKey: "amount", valueColor: "#8A8475" },
            { title: "Top Earners",      icon: Trophy, data: pool.topEarners,     valueKey: "amount", valueColor: "#D4872A" },
          ].map(({ title, icon: Icon, data, valueKey, valueColor }) => (
            <Card key={title} className="p-5 space-y-3 border-[#2E2C28] bg-[#1A1916]">
              <div className="flex items-center justify-between border-b border-[#2E2C28] pb-2">
                <span className="text-xs font-bold text-[#F2EDDE] uppercase tracking-wider">{title}</span>
                <Icon className="h-4 w-4 text-[#8A8475]" />
              </div>
              {rewardPool.isLoading ? (
                <Skeleton className="h-12 w-full bg-[#2E2C28]" />
              ) : (data as any[]).length > 0 ? (
                <div className="space-y-2">
                  {(data as any[]).slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[#8A8475]">{truncateAddress(item.walletAddress)}</span>
                      <span className="font-bold" style={{ color: valueColor }}>{item[valueKey]} XLM</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8A8475]">No data yet.</p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Disbursements Ledger */}
      <Card className="p-5 space-y-3 border-[#2E2C28] bg-[#1A1916]">
        <h3 className="text-sm font-bold text-[#F2EDDE]">Disbursements</h3>
        {rewardPool.isLoading ? (
          <Skeleton className="h-12 w-full bg-[#2E2C28]" />
        ) : pool.historicalDistributions.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto safe-scrollbar">
            {pool.historicalDistributions.slice(0, 5).map((dist, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-[#2E2C28] pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-semibold text-[#F2EDDE]">{dist.reason}</span>
                  <p className="text-[10px] text-[#8A8475]">{new Date(dist.distributedAt).toLocaleDateString()}</p>
                </div>
                <span className="font-mono font-bold text-[#D4872A]">+{dist.amount} XLM</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#8A8475] flex flex-col items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-[#2E2C28]" />
            No payouts logged yet.
          </div>
        )}
      </Card>
    </div>
  );
}
