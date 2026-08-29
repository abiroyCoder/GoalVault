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
      <div className="border-b border-[#2E2C28] pb-4">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          className="text-2xl text-[#F2EDDE]">Wallet</h1>
        <p className="text-xs text-[#8A8475] mt-1">Connect and manage your Stellar identity</p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" id="tour-step-wallet">
        {/* Connection Panel */}
        <Card className="p-5 space-y-4 border-[#2E2C28] bg-[#1A1916]">
          {wallet.connected && wallet.address ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#D4872A]/25 bg-[#D4872A]/8 px-3.5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#3D9E6A]" />
                  <span className="text-xs font-semibold text-[#3D9E6A]">Active · {wallet.provider}</span>
                </div>
                <Badge className="bg-[#3D9E6A]/10 border-[#3D9E6A]/25 text-[#3D9E6A]">Connected</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={wallet.address}
                    className="w-full rounded-xl border border-[#2E2C28] bg-[#0F0E0D] px-3 py-2 text-xs font-mono text-[#8A8475] outline-none truncate"
                  />
                  <Button onClick={handleCopy} variant="secondary" className="px-3">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-[#2E2C28] pb-2.5">
                  <span className="text-[#8A8475]">Network</span>
                  <span className="font-semibold text-[#F2EDDE] capitalize">{wallet.network}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8A8475]">Smart escrow</span>
                  <span className="font-semibold text-[#F2EDDE] flex items-center gap-1">
                    Soroban <Link2 className="h-3 w-3 text-[#8A8475]" />
                  </span>
                </div>
              </div>

              <Button onClick={wallet.disconnect} variant="danger" className="w-full text-xs font-semibold py-2.5">
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              <p className="text-xs text-[#8A8475]">Connect a wallet to interact with GoalVault smart contracts</p>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <Button onClick={handleConnectFreighter} disabled={connectingType !== null} className="h-11 text-xs font-bold">
                  {connectingType === "freighter" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                  Freighter
                </Button>
                <Button onClick={handleConnectAlbedo} disabled={connectingType !== null} variant="secondary" className="h-11 text-xs font-semibold">
                  {connectingType === "albedo" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                  Albedo
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Balance Panel */}
        <Card className="p-5 flex flex-col justify-between border-[#2E2C28] bg-[#1A1916] stat-card-accent relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-[#D4872A]/6 blur-2xl pointer-events-none" />
          <h3 className="text-sm font-semibold text-[#F2EDDE] relative">XLM Balance</h3>
          <div className="my-4 py-4 text-center border-y border-[#2E2C28] relative">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A8475] mb-2">Available</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
              className="text-4xl text-[#D4872A] flex items-baseline justify-center gap-1.5">
              {wallet.connected ? wallet.balance.toLocaleString() : "—"}
              <span className="text-sm font-semibold text-[#8A8475]">XLM</span>
            </p>
          </div>
          <div className="text-xs text-[#8A8475] relative">
            {wallet.connected && (
              <a
                href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D4872A] hover:text-[#F0A93C] transition-colors font-semibold"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
