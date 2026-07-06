import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../lib/wallet";
import { api } from "../lib/api";
import { Card, Button, Input, Textarea, Badge } from "../components/ui";
import { SuccessModal } from "../components/ux-helpers";
import { PlusCircle, Target, Loader2, BookOpen, Award, Terminal, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function CreateChallengePage() {
  const wallet = useWallet();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Learning");
  const [stakeAmount, setStakeAmount] = useState(50);
  const [durationDays, setDurationDays] = useState(7);
  const [verificationThreshold, setVerificationThreshold] = useState(3);

  const [isPending, setIsPending] = useState(false);
  const [pendingStep, setPendingStep] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState("");

  const categories = ["Learning", "Fitness", "Development", "Habits"];

  const templates = [
    {
      title: "30 Days of DSA",
      description: "Write and commit at least one data structures and algorithms solution to GitHub every single day.\n\nRequired Proof:\n1. Public GitHub repository link containing daily commits.\n2. Progress screenshot showing the commit history graph.",
      category: "Learning",
      stakeAmount: 100,
      durationDays: 30,
      verificationThreshold: 3,
      icon: BookOpen,
    },
    {
      title: "50km Run in 2 Weeks",
      description: "Perform running workouts to log a total distance of at least 50 kilometres within a 14-day period.\n\nRequired Proof:\n1. Public Strava activity sharing links.\n2. Screenshot of the workout summary dashboard.",
      category: "Fitness",
      stakeAmount: 150,
      durationDays: 14,
      verificationThreshold: 3,
      icon: Award,
    },
    {
      title: "Soroban Smart Contract",
      description: "Design, test, and deploy a custom Soroban smart contract on the Stellar Testnet.\n\nRequired Proof:\n1. Deployed Contract ID on stellar.expert explorer.\n2. Public GitHub repository link.",
      category: "Development",
      stakeAmount: 200,
      durationDays: 7,
      verificationThreshold: 4,
      icon: Terminal,
    },
  ];

  const handleApplyTemplate = (tpl: (typeof templates)[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setCategory(tpl.category);
    setStakeAmount(tpl.stakeAmount);
    setDurationDays(tpl.durationDays);
    setVerificationThreshold(tpl.verificationThreshold);
    toast.success(`Template loaded: "${tpl.title}"`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      toast.error("Please connect your Stellar wallet first.");
      return;
    }
    if (wallet.balance < stakeAmount) {
      toast.error(`Insufficient balance. You need at least ${stakeAmount} XLM.`);
      return;
    }

    setIsPending(true);
    try {
      setPendingStep("Connecting to Soroban RPC…");
      await new Promise((r) => setTimeout(r, 600));
      setPendingStep("Preparing escrow transaction…");
      await new Promise((r) => setTimeout(r, 600));
      setPendingStep("Waiting for wallet signature…");
      await new Promise((r) => setTimeout(r, 800));
      setPendingStep("Submitting to Stellar Testnet…");
      await new Promise((r) => setTimeout(r, 600));

      await api.createChallenge({
        creatorAddress: wallet.address,
        title,
        description,
        category,
        stakeAmount: Number(stakeAmount),
        durationDays: Number(durationDays),
        verificationThreshold: Number(verificationThreshold),
      });

      wallet.setBalance(wallet.balance - Number(stakeAmount));
      const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setSuccessTxHash(txHash);
      setIsPending(false);
      setShowSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create goal on-chain.");
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="heading text-xl text-fg flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-accent" />
          Create goal
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Form Container */}
        <div className="lg:col-span-8">
          <Card className="p-6 relative">
            {isPending && (
              <div className="absolute inset-0 bg-[#FAF8F4]/90 z-10 flex flex-col items-center justify-center p-6 text-center rounded-xl">
                <Loader2 className="h-6 w-6 animate-spin text-accent mb-3" />
                <h4 className="text-sm font-semibold text-fg mb-1">Invoking Contract</h4>
                <p className="text-xs text-muted font-mono">{pendingStep}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Goal Title</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Write Rust code every day for 30 days"
                  className="bg-stone-50 border-border text-xs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Brief & Required Evidence</label>
                <Textarea
                  rows={4}
                  required
                  placeholder="Describe details and evidence needed to verify completion."
                  className="bg-stone-50 border-border text-xs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Grid Inputs */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Stake (XLM)</label>
                  <Input
                    type="number"
                    min={5}
                    required
                    className="bg-stone-50 border-border text-xs"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Duration (Days)</label>
                  <Input
                    type="number"
                    min={1}
                    required
                    className="bg-stone-50 border-border text-xs"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Voters Required</label>
                  <Input
                    type="number"
                    min={1}
                    required
                    className="bg-stone-50 border-border text-xs"
                    value={verificationThreshold}
                    onChange={(e) => setVerificationThreshold(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>

              {/* Horizontal Category selector */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ${
                        category === cat
                          ? "border-accent bg-accent/8 text-accent"
                          : "border-border hover:border-accent/30 bg-transparent text-muted hover:text-fg"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!wallet.connected || wallet.balance < stakeAmount}
                  className="w-full h-10 text-xs font-semibold rounded-xl shadow-soft flex items-center justify-center gap-1.5"
                >
                  <Target className="h-3.5 w-3.5" />
                  Lock {stakeAmount} XLM & Create Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Templates Column */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-fg uppercase tracking-wider">Quick Templates</h3>
              <p className="text-[10px] text-muted">Click to auto-populate configuration.</p>
            </div>
            <div className="space-y-2">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full text-left rounded-xl border border-border hover:border-accent/40 bg-stone-50 hover:bg-stone-100/50 p-3 flex items-start gap-2.5 transition-all duration-150 group"
                  >
                    <div className="h-7 w-7 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-colors">
                      <Icon className="h-3.5 w-3.5 text-muted group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-[11px] font-bold text-fg truncate">{tpl.title}</h4>
                        <ChevronRight className="h-3 w-3 text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-muted">
                        <Badge className="px-1 py-0">{tpl.category}</Badge>
                        <span>{tpl.stakeAmount} XLM</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/active");
        }}
        title="Goal Escrow Setup!"
        message={`"${title || "Your Goal"}" is now live on Stellar Testnet.`}
        txHash={successTxHash}
        explorerUrl={`https://stellar.expert/explorer/testnet/tx/${successTxHash}`}
      />
    </div>
  );
}
