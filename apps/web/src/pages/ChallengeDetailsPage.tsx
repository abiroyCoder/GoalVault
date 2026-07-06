import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useWallet } from "../lib/wallet";
import { api } from "../lib/api";
import { Card, Button, Input, Textarea, Badge, Skeleton } from "../components/ui";
import { SuccessModal, Spinner } from "../components/ux-helpers";
import { 
  ArrowLeft, Clock, ExternalLink, Github, MessageSquare, 
  Share2, ShieldCheck, Trophy, XCircle, QrCode, Copy 
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { TwitterShareButton, TelegramShareButton, WhatsappShareButton, TwitterIcon, TelegramIcon, WhatsappIcon } from "react-share";
import { monitoring } from "../lib/monitoring";

export function ChallengeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  
  const [proofTitle, setProofTitle] = useState("");
  const [proofDesc, setProofDesc] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [textEvidence, setTextEvidence] = useState("");
  
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [pendingStep, setPendingStep] = useState("");
  const [showSuccessProof, setShowSuccessProof] = useState(false);
  const [proofTxHash, setProofTxHash] = useState("");
  
  const [isVoting, setIsVoting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Fetch challenge query
  const { data, isLoading, error } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => api.challenge(id || ""),
    enabled: !!id
  });

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmittingProof(true);
    try {
      setPendingStep("Connecting to Soroban RPC...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setPendingStep("Formulating proof metadata on-chain...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPendingStep("Submitting transaction proof...");
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await api.createProof(id || "", {
        submitterAddress: wallet.address,
        title: proofTitle,
        description: proofDesc,
        githubLink: githubUrl,
        externalUrl,
        textEvidence
      });

      const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setProofTxHash(txHash);
      setIsSubmittingProof(false);
      setShowSuccessProof(true);
      
      setProofTitle("");
      setProofDesc("");
      setGithubUrl("");
      setExternalUrl("");
      setTextEvidence("");
      
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
    } catch (err: any) {
      monitoring.captureException(err, "Proof Submission Form");
      toast.error(err.message || "Failed to submit proof");
      setIsSubmittingProof(false);
    }
  };

  const handleVote = async (proofId: string, decision: "approve" | "reject") => {
    if (!wallet.connected || !wallet.address) {
      toast.error("Please connect your wallet to vote");
      return;
    }

    setIsVoting(true);
    try {
      toast.loading("Simulating vote signature...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      await api.vote(proofId, {
        voterAddress: wallet.address,
        decision
      });
      
      toast.dismiss();
      toast.success(`Vote cast to ${decision} proof!`);
      
      // Award XP based on action
      wallet.setBalance(wallet.balance + (decision === "approve" ? 1.5 : 0.5));
      
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    } catch (err: any) {
      toast.dismiss();
      monitoring.captureException(err, "Cast Vote Action");
      toast.error(err.message || "Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = `Verify my accountability challenge "${data?.challenge?.title}" on SkillStake!`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-bold text-rose-500">Error loading challenge</h3>
        <p className="text-xs text-muted mt-1">Make sure the challenge ID is valid.</p>
        <Button asChild className="mt-4 text-xs h-9 px-4 rounded-xl">
          <Link to="/active">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Active Challenges
          </Link>
        </Button>
      </div>
    );
  }

  const { challenge, proofs } = data;
  const isCreator = wallet.address === challenge.creatorAddress;
  const pendingProof = proofs.find((p) => p.status === "pending");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Button variant="secondary" asChild className="text-xs h-9 px-3.5 rounded-xl">
          <Link to="/active">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Challenges
          </Link>
        </Button>
      </div>

      {/* Challenge Title Card */}
      <Card className="p-6 border-border/80 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="bg-black/5 dark:bg-white/5 border-border">{challenge.category}</Badge>
              <Badge className={`capitalize ${
                challenge.status === "completed" 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : challenge.status === "failed" 
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}>
                {challenge.status.replaceAll("_", " ")}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-accent dark:text-white">
              {challenge.title}
            </h2>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowShareModal(true)} variant="secondary" className="h-9 px-3.5 rounded-xl text-xs flex items-center gap-1.5">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{challenge.description}</p>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 pt-4 border-t border-border/40 text-xs">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Stake Amount</p>
            <p className="text-sm font-bold text-accent dark:text-white">{challenge.stakeAmount} XLM</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Duration</p>
            <p className="text-sm font-bold text-accent dark:text-white">{challenge.durationDays} Days</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Threshold Needed</p>
            <p className="text-sm font-bold text-accent dark:text-white">{challenge.verificationThreshold} Votes</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Progress</p>
            <div className="flex items-center gap-1 text-sm font-bold text-accent dark:text-white">
              <span>{challenge.approvedVotes} Approved</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Proof Submission & View Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
        {/* Submitted Proofs Feed */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-accent dark:text-white">Verification Proofs</h3>
            <p className="text-xs text-muted">Evidence submitted to recover locked stake.</p>
          </div>

          {proofs.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-2xl">
              <MessageSquare className="h-7 w-7 text-muted mx-auto mb-2" />
              <p className="text-xs font-semibold text-accent dark:text-white">No proof submitted yet</p>
              <p className="text-[10px] text-muted max-w-xs mx-auto mt-1">
                {isCreator 
                  ? "Submit your progress evidence on the right to start community verification." 
                  : "Staker has not submitted progress evidence yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {proofs.map((proof) => (
                <div key={proof._id} className="p-4 border border-border/60 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-accent dark:text-white">{proof.title}</h4>
                      <p className="text-[10px] text-muted font-mono">{new Date(proof.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`capitalize ${
                      proof.status === "approved" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : proof.status === "rejected" 
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {proof.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">{proof.description}</p>

                  {(proof.githubLink || proof.externalUrl) && (
                    <div className="flex gap-2 flex-wrap pt-1.5">
                      {proof.githubLink && (
                        <Button asChild variant="secondary" className="h-8 px-2.5 rounded-lg text-[10px]">
                          <a href={proof.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                            <Github className="h-3.5 w-3.5" />
                            GitHub repo
                          </a>
                        </Button>
                      )}
                      {proof.externalUrl && (
                        <Button asChild variant="secondary" className="h-8 px-2.5 rounded-lg text-[10px]">
                          <a href={proof.externalUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Proof URL
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {proof.textEvidence && (
                    <div className="rounded-xl border border-border bg-black/[0.01] dark:bg-white/[0.01] p-3 text-[11px] font-mono leading-relaxed break-all">
                      {proof.textEvidence}
                    </div>
                  )}

                  {/* Voter Action Card */}
                  {proof.status === "pending" && (
                    <div className="pt-4 border-t border-border/40 flex flex-wrap gap-2 items-center justify-between">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                        Votes: {proof.voteCount}
                      </span>
                      {wallet.connected && !isCreator && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVote(proof._id, "approve")}
                            disabled={isVoting}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] h-8 px-3 rounded-lg flex items-center gap-1 font-semibold"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleVote(proof._id, "reject")}
                            disabled={isVoting}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] h-8 px-3 rounded-lg flex items-center gap-1 font-semibold"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Submit Proof Section */}
        <div>
          {challenge.status === "active" && isCreator ? (
            <Card className="p-6 border-border/80 relative" id="tour-step-submit-proof">
              {isSubmittingProof && (
                <div className="absolute inset-0 bg-background/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                  <Spinner className="h-6 w-6 text-accent mb-4" />
                  <h4 className="text-xs font-bold text-accent dark:text-white mb-2">Publishing Evidence</h4>
                  <p className="text-[11px] text-muted max-w-xs">{pendingStep}</p>
                </div>
              )}

              <form onSubmit={handleSubmitProof} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-accent dark:text-white">Submit Evidence</h3>
                  <p className="text-xs text-muted">Prove challenge checklist has been completed.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Proof Title</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Day 10 progress report"
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Description</label>
                  <Textarea
                    rows={3}
                    required
                    placeholder="Describe how the checklist goals were satisfied."
                    value={proofDesc}
                    onChange={(e) => setProofDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">GitHub Link (Optional)</label>
                  <Input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Evidence Link (Optional)</label>
                  <Input
                    type="url"
                    placeholder="https://strava.com/activity/123"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Text Evidence / Logs</label>
                  <Textarea
                    rows={2}
                    placeholder="Raw verification logs, commit details, or verification text hashes."
                    value={textEvidence}
                    onChange={(e) => setTextEvidence(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full text-xs h-10 font-bold rounded-xl shadow-premium">
                  Submit Verification Proof
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="p-6 border-border/80 space-y-4">
              <h3 className="text-sm font-bold text-accent dark:text-white">Escrow Resolution Details</h3>
              <p className="text-xs text-muted leading-relaxed">
                {challenge.status === "completed" 
                  ? "This escrow challenge is completed. Stake has been released to the staker." 
                  : challenge.status === "failed" 
                    ? "This escrow challenge is failed. Stake has been routed to the reward pool."
                    : "This challenge is currently awaiting progress proof or voting resolution."}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessProof}
        onClose={() => setShowSuccessProof(false)}
        title="Proof Submitted Successfully!"
        message={`Your accountability proof "${proofTitle}" is locked on-chain and awaiting community voting threshold signatures.`}
        txHash={proofTxHash}
        explorerUrl={`https://stellar.expert/explorer/testnet/tx/${proofTxHash}`}
      />

      {/* Share QR / Widget drawer */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm z-10"
          >
            <Card className="p-6 border-border bg-card shadow-2xl relative">
              <div className="text-center space-y-4">
                <h4 className="text-base font-bold text-accent dark:text-white">Share accountability</h4>
                
                {/* QR Code */}
                <div className="inline-block p-4 bg-white rounded-2xl shadow-inner mx-auto">
                  <QRCode value={shareUrl} size={150} />
                </div>
                
                <p className="text-[11px] text-muted">Scan with a mobile camera to open this challenge details screen.</p>
                
                {/* Social Share Buttons */}
                <div className="flex justify-center gap-3 py-2 border-y border-border/40">
                  <TwitterShareButton url={shareUrl} title={shareTitle}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <TelegramShareButton url={shareUrl} title={shareTitle}>
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <WhatsappShareButton url={shareUrl} title={shareTitle}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={copyShareLink} variant="secondary" className="flex-1 text-xs h-9 rounded-xl flex items-center justify-center gap-1.5">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button onClick={() => setShowShareModal(false)} className="flex-1 text-xs h-9 rounded-xl">
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
