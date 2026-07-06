import { useState } from "react";
import { useWallet } from "../lib/wallet";
import { useDappStore } from "../lib/store";
import { Card, Button, Badge, Progress } from "../components/ui";
import { 
  User, Star, Flame, Trophy, Coins, QrCode, Copy, 
  ExternalLink, Calendar, CheckCircle2, AlertTriangle, Share2 
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { TwitterShareButton, TelegramShareButton, WhatsappShareButton, TwitterIcon, TelegramIcon, WhatsappIcon } from "react-share";

export function ProfilePage() {
  const wallet = useWallet();
  const getProfile = useDappStore((state) => state.getProfile);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!wallet.connected || !wallet.address) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mx-auto text-accent dark:text-white">
          <User className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-accent dark:text-white">Profile Disconnected</h3>
        <p className="text-xs text-muted leading-relaxed">
          Please connect your Freighter or Albedo wallet to view your reputation levels, unlocked badges, and accountability history.
        </p>
        <Button asChild className="text-xs h-9.5 px-4 rounded-xl">
          <a href="/wallet">Go to Wallet Settings</a>
        </Button>
      </div>
    );
  }

  const { user, achievements, challenges } = getProfile(wallet.address);
  const completedCount = challenges.filter(c => c.status === "completed").length;
  const failedCount = challenges.filter(c => c.status === "failed").length;

  const xpProgress = user.xp % 1000;
  const nextLevelXp = 1000;
  
  const shareUrl = window.location.href;
  const shareTitle = `Check out my accountability profile on SkillStake (Level: ${user.level}, XP: ${user.xp})!`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Profile share link copied");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Profile Info */}
      <Card className="p-6 border-border/80 relative overflow-hidden" id="tour-step-profile">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl border border-border bg-black/5 dark:bg-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
            <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-accent dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  {user.displayName}
                </h2>
                <p className="text-[10px] text-muted font-mono truncate max-w-[200px] sm:max-w-xs">{user.walletAddress}</p>
              </div>
              <Button onClick={() => setShowShareModal(true)} variant="secondary" className="h-8.5 px-3 rounded-xl text-xs flex items-center gap-1.5">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center sm:justify-start text-xs text-muted pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined June 2026
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
                Level {user.level}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: XP & Stats */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_1.2fr]">
        {/* Stats Column */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-accent dark:text-white">Accountability Metrics</h3>
            <p className="text-xs text-muted">A summary of commitment resolutions.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-2.5 border-b border-border/40">
              <span className="text-muted flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-blue-500" />
                Total Challenges
              </span>
              <span className="font-bold text-accent dark:text-white">{challenges.length}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40">
              <span className="text-muted flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Completed Escrows
              </span>
              <span className="font-bold text-emerald-500">{completedCount}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40">
              <span className="text-muted flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                Failed Escrows
              </span>
              <span className="font-bold text-rose-500">{failedCount}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40">
              <span className="text-muted flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" />
                Verification success rate
              </span>
              <span className="font-bold text-accent dark:text-white">{user.successRate}%</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-border/40">
              <span className="text-muted flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                Current Streak
              </span>
              <span className="font-bold text-orange-500">{user.streakDays} Days</span>
            </div>
          </div>
        </Card>

        {/* XP Level Box */}
        <Card className="p-6 border-border/80 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-accent dark:text-white">XP Progression</h3>
            <p className="text-xs text-muted">Complete tasks, submit proofs, and vote to earn level multipliers.</p>
          </div>

          <div className="my-6 space-y-3">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-bold text-accent dark:text-white">Level: {user.level}</span>
              <span className="text-muted font-mono">{user.xp.toLocaleString()} XP</span>
            </div>
            <Progress value={(xpProgress / nextLevelXp) * 100} />
            <p className="text-[10px] text-muted text-right">
              {nextLevelXp - xpProgress} XP until next level unlock.
            </p>
          </div>

          <div className="text-[10px] text-muted leading-relaxed bg-black/[0.01] dark:bg-white/[0.01] p-3 rounded-xl border border-border">
            XP rates: Challenge Creation (+100 XP), Proof Submission (+50 XP), Approval Vote (+25 XP), and Rejection Vote (+15 XP).
          </div>
        </Card>
      </div>

      {/* Unlocked Achievements Badges */}
      <Card className="p-6 border-border/80 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-accent dark:text-white">Gamification Achievements</h3>
          <p className="text-xs text-muted">Badges earned by staking XLM and voting in community escrows.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <div
              key={ach.code}
              className={`p-4 border rounded-2xl flex items-start gap-3 transition-all duration-200 ${
                ach.unlocked
                  ? "border-accent bg-accent/[0.01] dark:bg-white/[0.003]"
                  : "border-border/50 bg-black/[0.01] dark:bg-white/[0.005] opacity-55"
              }`}
            >
              <span className="text-2xl p-1 bg-card border border-border/80 rounded-xl shadow-sm shrink-0">
                {ach.icon}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-accent dark:text-white">{ach.title}</h4>
                  {ach.unlocked && <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 scale-90 px-1 py-0 select-none">Unlocked</Badge>}
                </div>
                <p className="text-[11px] text-muted leading-normal">{ach.description}</p>
                <p className="text-[10px] text-accent dark:text-white font-semibold">+{ach.xpReward} XP</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Share Drawer Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowShareModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm z-10">
            <Card className="p-6 border-border bg-card shadow-2xl relative">
              <div className="text-center space-y-4">
                <h4 className="text-base font-bold text-accent dark:text-white">Share reputation</h4>
                
                {/* QR Code */}
                <div className="inline-block p-4 bg-white rounded-2xl shadow-inner mx-auto">
                  <QRCode value={shareUrl} size={150} />
                </div>
                
                <p className="text-[11px] text-muted">Scan to open my user profile dashboard on the Stellar network.</p>
                
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
                  <Button onClick={copyProfileLink} variant="secondary" className="flex-1 text-xs h-9 rounded-xl flex items-center justify-center gap-1.5">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button onClick={() => setShowShareModal(false)} className="flex-1 text-xs h-9 rounded-xl">
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
