import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Coins, Trophy, ArrowUpRight, ShieldCheck } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="heading text-xl text-fg">Reward Vault</h2>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1fr_1.3fr]">
        {/* Balance Card */}
        <Card className="p-6 flex flex-col justify-between stat-card-accent">
          <div>
            <Badge>Treasury</Badge>
            <h3 className="mt-2 text-sm font-semibold text-fg">Active Vault</h3>
          </div>
          <div className="my-4 text-center">
            {rewardPool.isLoading ? (
              <Skeleton className="h-10 w-32 mx-auto" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-fg flex items-baseline justify-center gap-1.5">
                {formatAmount(pool.currentBalance)}
                <span className="text-xs font-semibold text-muted">XLM</span>
              </p>
            )}
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Funded by forfeited stakes. Automatically distributed to active verifiers.
          </p>
        </Card>

        {/* Top Contributors / Earners */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-fg uppercase tracking-wider">Top Contributors</span>
              <Coins className="h-4 w-4 text-muted" />
            </div>
            {rewardPool.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : pool.topContributors.length > 0 ? (
              <div className="space-y-2">
                {pool.topContributors.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-mono text-muted">{truncateAddress(c.walletAddress)}</span>
                    <span className="font-semibold text-fg">{c.amount} XLM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No contributors logged.</p>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-fg uppercase tracking-wider">Top Earners</span>
              <Trophy className="h-4 w-4 text-muted" />
            </div>
            {rewardPool.isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : pool.topEarners.length > 0 ? (
              <div className="space-y-2">
                {pool.topEarners.slice(0, 3).map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-mono text-muted">{truncateAddress(e.walletAddress)}</span>
                    <span className="font-semibold text-accent">{e.amount} XLM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No earners logged.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Ledger */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-fg">Disbursements</h3>
        {rewardPool.isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : pool.historicalDistributions.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto safe-scrollbar">
            {pool.historicalDistributions.slice(0, 5).map((dist, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-border pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-semibold text-fg">{dist.reason}</span>
                  <p className="text-[10px] text-muted">{new Date(dist.distributedAt).toLocaleDateString()}</p>
                </div>
                <span className="font-mono font-bold text-accent">+{dist.amount} XLM</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-muted flex flex-col items-center gap-1">
            <ShieldCheck className="h-5 w-5 text-muted/40" />
            No payouts logged.
          </div>
        )}
      </Card>
    </div>
  );
}
