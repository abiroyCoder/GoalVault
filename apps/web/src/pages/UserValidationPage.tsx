import { useState } from "react";
import { useDappStore } from "../lib/store";
import { useWallet } from "../lib/wallet";
import { Card, Button, Input, Textarea, Badge } from "../components/ui";
import { ShieldCheck, Download, Clipboard, Star } from "lucide-react";
import { toast } from "sonner";

export function UserValidationPage() {
  const wallet = useWallet();
  const { telemetryLogs, feedbackLogs, addFeedback } = useDappStore();

  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      toast.error("Connect wallet to submit feedback.");
      return;
    }
    if (!feedbackText.trim()) return;

    addFeedback(wallet.address, displayName || "Anonymous Staker", rating, feedbackText);
    setDisplayName("");
    setRating(5);
    setFeedbackText("");
  };

  const exportTelemetryJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify({
          exportedAt: new Date().toISOString(),
          telemetryLogs,
          feedbackLogs
        }, null, 2)
      );
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "goalvault_telemetry.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Telemetry exported.");
    } catch {
      toast.error("Export failed");
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="heading text-xl text-fg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          Validation Logs
        </h2>
        <Button onClick={exportTelemetryJson} className="text-xs h-9 px-3 rounded-xl gap-1.5 shadow-soft">
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left: Telemetry list */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-xs font-bold text-fg uppercase tracking-wider">Ledger interactions</span>
            <Badge>{telemetryLogs.length} logs</Badge>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto safe-scrollbar">
            {telemetryLogs.map((log) => (
              <div key={log._id} className="p-3 border border-border rounded-xl text-xs space-y-2 hover:border-accent/30 transition-all">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted truncate max-w-[120px]">{log.walletAddress}</span>
                    <Badge className="bg-accent/8 border-accent/20 text-accent font-semibold px-1 py-0 capitalize">
                      {log.actionType.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center rounded-lg bg-stone-50 border border-border px-2 py-1.5 font-mono text-[10px] text-[#646460]">
                  <span className="truncate">Tx: {log.txHash}</span>
                  <button onClick={() => copyHash(log.txHash)} className="hover:text-fg ml-2 shrink-0">
                    <Clipboard className="h-3.5 w-3.5 text-muted hover:text-fg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Feedback & comments */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <span className="text-xs font-bold text-fg uppercase tracking-wider block">Submit Feedback</span>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Staker"
                  className="bg-stone-50 border-border text-xs"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)}>
                      <Star className={`h-4 w-4 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Message</label>
                <Textarea
                  rows={2}
                  required
                  placeholder="Your feedback…"
                  className="bg-stone-50 border-border text-xs"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={!wallet.connected} className="w-full h-10 text-xs font-semibold shadow-soft">
                Submit
              </Button>
            </form>
          </Card>

          <Card className="p-5 space-y-3">
            <span className="text-xs font-bold text-fg uppercase tracking-wider block">Staker Comments</span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto safe-scrollbar pr-0.5">
              {feedbackLogs.map((fb) => (
                <div key={fb._id} className="space-y-1 pb-2 border-b border-border last:border-0 last:pb-0 text-xs">
                  <div className="flex justify-between items-baseline gap-1.5">
                    <span className="font-semibold text-fg">{fb.displayName}</span>
                    <span className="text-[9px] text-muted font-mono truncate max-w-[80px]">{fb.walletAddress}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-muted leading-relaxed mt-0.5">{fb.feedbackText}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
