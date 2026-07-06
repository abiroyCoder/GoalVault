import { Card, Badge, Button } from "../components/ui";
import { ShieldAlert, Cpu, Network, Info } from "lucide-react";
import { api } from "../lib/api";

export function AdminDashboardPage() {
  const contractId = import.meta.env.VITE_CONTRACT_ID || "CDUVOWAI5HYXXC3XCXS6NMWSCXL7WHHIEHYRHME2E4DWYUPRSJ5JBEW5";
  const passphrase = import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
  const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-accent dark:text-white" />
          Soroban Contract Admin Inspector
        </h2>
        <p className="text-sm text-muted">Dev inspector panel detailing deployed contract states and network passphrases.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" id="tour-step-admin">
        {/* Left Card: Contract Details */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-accent dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-muted" />
              Smart Contract Specifications
            </h3>
            <p className="text-xs text-muted">Deployed code references on the public ledger.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Contract ID</label>
              <div className="rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 font-mono text-fg break-all select-all leading-relaxed">
                {contractId}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Stellar network passphrase</label>
              <div className="rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 font-mono text-fg break-all select-all leading-relaxed">
                {passphrase}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Soroban RPC endpoint</label>
              <div className="rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 font-mono text-fg break-all select-all leading-relaxed">
                {rpcUrl}
              </div>
            </div>
          </div>
        </Card>

        {/* Right Card: Platform Auditing Info */}
        <Card className="p-6 border-border/80 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-accent dark:text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-muted" />
              Ledger State
            </h3>
            <p className="text-xs text-muted">Stellar consensus synchronization flags.</p>
          </div>

          <div className="space-y-3.5 text-xs py-4">
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-muted">RPC Connection</span>
              <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 scale-90">Synced</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40">
              <span className="text-muted">Escrow Account Lock</span>
              <span className="font-bold text-accent dark:text-white">Enabled</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted">Voting Threshold</span>
              <span className="font-bold text-accent dark:text-white">Dynamic (min 3)</span>
            </div>
          </div>

          <div className="text-[10px] text-muted leading-relaxed flex items-start gap-2.5 bg-black/[0.01] dark:bg-white/[0.01] p-3 rounded-xl border border-border">
            <Info className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
            <p>
              Admin roles cannot bypass voting verification criteria. Escrow payouts are unlocked solely via signed community threshold hashes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
