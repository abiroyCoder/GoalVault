import { useState } from "react";
import { useWallet } from "../lib/wallet";
import { Card, Button, Badge } from "../components/ui";
import { Wallet, CheckCircle, Copy, LogOut, Loader2, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { analytics } from "../lib/analytics";

export function WalletPage() {
  const wallet = useWallet();
  const [connectingType, setConnectingType] = useState<"freighter" | "albedo" | null>(null);

  const handleConnectFreighter = async () => {
    setConnectingType("freighter");
    try {
      await wallet.connectFreighter();
      toast.success("Freighter connected!");
      analytics.trackEvent("wallet_connected", { provider: "freighter" });
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setConnectingType(null);
    }
  };

  const handleConnectAlbedo = async () => {
    setConnectingType("albedo");
    try {
      await wallet.connectAlbedo();
      toast.success("Albedo connected!");
      analytics.trackEvent("wallet_connected", { provider: "albedo" });
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    } finally {
      setConnectingType(null);
    }
  };

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success("Copied address.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="heading text-xl text-fg">Wallet settings</h2>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" id="tour-step-wallet">
        {/* Connection Panel */}
        <Card className="p-5 space-y-4">
          {wallet.connected && wallet.address ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-accent/20 bg-accent/5 px-3.5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold text-accent">Active · {wallet.provider}</span>
                </div>
                <Badge>Connected</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={wallet.address}
                    className="w-full rounded-xl border border-border bg-stone-50 px-3 py-2 text-xs font-mono text-fg outline-none truncate"
                  />
                  <Button onClick={handleCopy} variant="secondary" className="px-3">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-border pb-2.5">
                  <span className="text-muted">Network</span>
                  <span className="font-semibold text-fg capitalize">{wallet.network}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted">Smart escrow</span>
                  <span className="font-semibold text-fg flex items-center gap-1">
                    Soroban <Link2 className="h-3 w-3 text-muted" />
                  </span>
                </div>
              </div>

              <Button onClick={wallet.disconnect} variant="secondary" className="w-full text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 py-2.5">
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-3 py-1">
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <Button onClick={handleConnectFreighter} disabled={connectingType !== null} className="h-11 text-xs font-semibold shadow-soft">
                  {connectingType === "freighter" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4 mr-1.5" />}
                  Freighter
                </Button>
                <Button onClick={handleConnectAlbedo} disabled={connectingType !== null} variant="secondary" className="h-11 text-xs font-semibold">
                  {connectingType === "albedo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4 mr-1.5" />}
                  Albedo
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Balance Panel */}
        <Card className="p-5 flex flex-col justify-between stat-card-accent">
          <div>
            <h3 className="text-sm font-semibold text-fg">XLM Balance</h3>
          </div>
          <div className="my-4 py-3 text-center border-y border-border">
            <p className="text-3xl font-bold tracking-tight text-fg flex items-baseline justify-center gap-1.5">
              {wallet.connected ? wallet.balance.toLocaleString() : "—"}
              <span className="text-xs font-semibold text-muted">XLM</span>
            </p>
          </div>
          <div className="text-xs text-muted">
            {wallet.connected && (
              <a
                href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-accent hover:underline font-semibold"
              >
                Explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
