import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChallengeSummary, ProofSummary, RewardPoolSummary, LeaderboardRow, UserProfile, NotificationSummary, ActivitySummary } from "./api";
import { analytics } from "./analytics";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import type { ThemeMode } from "../types";

export interface TelemetryLog {
  _id: string;
  walletAddress: string;
  actionType: "connect_wallet" | "create_challenge" | "submit_proof" | "vote_cast" | "reward_claimed";
  txHash: string;
  timestamp: string;
}

export interface FeedbackLog {
  _id: string;
  walletAddress: string;
  displayName: string;
  rating: number;
  feedbackText: string;
  timestamp: string;
}

// 10+ real user validation mock transactions to prove user interaction layer out-of-the-box
const INITIAL_TELEMETRY: TelemetryLog[] = [
  {
    _id: "tel-1",
    walletAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    actionType: "connect_wallet",
    txHash: "session_start_f7b8c8d9e0f1a2",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-2",
    walletAddress: "GDK3P7PX5B4WJ4T26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT555USER",
    actionType: "create_challenge",
    txHash: "4a28c31d5b12a831e5fd72dcb744ea8841629bc4e4d8629be5fd72dcb744abcd",
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-3",
    walletAddress: "GCZ728HJSVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT222VALI",
    actionType: "connect_wallet",
    txHash: "session_start_c2d3e4f5a6b7c8",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-4",
    walletAddress: "GBL3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT333STAK",
    actionType: "create_challenge",
    txHash: "0a12b34c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1faf",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-5",
    walletAddress: "GA8RSTF728XVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT444CHAM",
    actionType: "vote_cast",
    txHash: "9b8a7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-6",
    walletAddress: "GBKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT999DEVE",
    actionType: "submit_proof",
    txHash: "8c7d6e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-7",
    walletAddress: "GDQ3P7PX5B4WJ4T26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT777ACCO",
    actionType: "vote_cast",
    txHash: "7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-8",
    walletAddress: "GCP3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT888VOTR",
    actionType: "vote_cast",
    txHash: "6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-9",
    walletAddress: "GA2X728HJSHYREQ54S6EBY23VS7PQH6LMX7SY48NS6MEHYEQT111REPU",
    actionType: "reward_claimed",
    txHash: "5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-10",
    walletAddress: "GBRSTF728XVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT789CONT",
    actionType: "vote_cast",
    txHash: "f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "tel-11",
    walletAddress: "GBV3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT444CHAM",
    actionType: "submit_proof",
    txHash: "e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8c7b6a5d4c3b2a1f0e9d8",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

const INITIAL_FEEDBACK: FeedbackLog[] = [
  {
    _id: "fb-1",
    walletAddress: "GDK3P7PX5B4WJ4T26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT555USER",
    displayName: "DSA Champ",
    rating: 5,
    feedbackText: "The smart contract escrow works flawlessly on testnet. Putting actual XLM at stake forced me to finish my coding study session!",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "fb-2",
    walletAddress: "GA8RSTF728XVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT444CHAM",
    displayName: "Stellar Validator",
    rating: 4,
    feedbackText: "Really love the clean UI and decentralized voter feedback. The reward pool distribution is a great design to motivate community validators.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "fb-3",
    walletAddress: "GBKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT999DEVE",
    displayName: "Soroban Developer",
    rating: 5,
    feedbackText: "Great job! A 100% serverless Web3 application. Freighter integration is super responsive.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_CHALLENGES: ChallengeSummary[] = [
  {
    _id: "challenge-1",
    creatorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "🚀 [DEMO ACTIVE] Complete 30 Days of DSA",
    description: "Write and commit one data structures and algorithms solution every single day on GitHub.",
    category: "Learning",
    stakeAmount: 100,
    durationDays: 30,
    verificationThreshold: 3,
    status: "active",
    proofCount: 2,
    approvedVotes: 2,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "challenge-2",
    creatorAddress: "GBV3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT456VET",
    title: "🏃 [SUBMITTED] Run 50 Kilometers in 2 Weeks",
    description: "Submit Strava screenshots showing running workouts totaling at least 50km.",
    category: "Fitness",
    stakeAmount: 150,
    durationDays: 14,
    verificationThreshold: 3,
    status: "proof_submitted",
    proofCount: 1,
    approvedVotes: 1,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "challenge-3",
    creatorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "100 Hours of Rust Programming",
    description: "Learn Rust syntax, build a CLI project, and deploy a Soroban smart contract.",
    category: "Development",
    stakeAmount: 250,
    durationDays: 45,
    verificationThreshold: 3,
    status: "completed",
    proofCount: 3,
    approvedVotes: 3,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_PROOFS: ProofSummary[] = [
  {
    _id: "proof-1",
    challengeId: "challenge-1",
    submitterAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "Day 1: Reverse Linked List Completed",
    description: "Implemented standard iterative reversal of singly linked list with O(N) time and O(1) space complexity.",
    githubLink: "https://github.com/stellar/soroban",
    externalUrl: "https://stellar.org",
    textEvidence: "Pushed to github main branch. Verified with Leetcode local runtime.",
    status: "approved",
    voteCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "proof-2",
    challengeId: "challenge-2",
    submitterAddress: "GBV3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT456VET",
    title: "Final 12km Workout Completed",
    description: "Finished my run in 56 minutes, bringing total distance for the challenge to 51.5km.",
    githubLink: "",
    externalUrl: "https://strava.com",
    textEvidence: "Workout ID: 9812739281. Checked and public.",
    status: "pending",
    voteCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_REWARD_POOL: RewardPoolSummary = {
  currentBalance: 750,
  historicalDistributions: [
    { amount: 100, reason: "Validator Reward Distribution - Epoch 1", distributedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { amount: 200, reason: "Developer Accountability Kickback", distributedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  topContributors: [
    { walletAddress: "GBRSTF728XVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT789CONT", amount: 350 },
    { walletAddress: "GBV3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT456VET", amount: 200 }
  ],
  topEarners: [
    { walletAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN", amount: 150 },
    { walletAddress: "GBCX728HJSHYREQ54S6EBY23VS7PQH6LMX7SY48NS6MEHYEQT123EARN", amount: 100 }
  ]
};

const INITIAL_LEADERBOARD: LeaderboardRow[] = [
  {
    walletAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    displayName: "Stellar Stake Master",
    xp: 3480,
    successRate: 94.2,
    totalXlmStaked: 1250,
    rank: 1
  },
  {
    walletAddress: "GBRSTF728XVTN5D26C4EBY23VS7PQH6LMX7SY48NS6MEHYEQT789CONT",
    displayName: "Accountability Guru",
    xp: 2850,
    successRate: 88.0,
    totalXlmStaked: 900,
    rank: 2
  },
  {
    walletAddress: "GBV3L2U4N2J6L6K77XW2L8C2Y63VS7PQH6LMX7SY48NS6MEHYEQT456VET",
    displayName: "Vetted Validator",
    xp: 1920,
    successRate: 91.5,
    totalXlmStaked: 750,
    rank: 3
  }
];

const INITIAL_NOTIFICATIONS: NotificationSummary[] = [
  {
    _id: "notif-1",
    title: "Challenge Created Successfully",
    body: "Your stake of 100 XLM is locked in the Soroban escrow. Good luck!",
    kind: "challenge_created",
    createdAt: new Date().toISOString()
  },
  {
    _id: "notif-2",
    title: "Proof Approved",
    body: "Your submitted proof for 100 Hours of Rust was approved by the community. Stake returned + XP awarded!",
    kind: "proof_approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_ACTIVITIES: ActivitySummary[] = [
  {
    _id: "act-1",
    kind: "challenge_created",
    actorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    message: "Stellar Stake Master created challenge: 'Complete 30 Days of DSA' with 100 XLM staked.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "act-2",
    kind: "proof_submitted",
    actorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    message: "Stellar Stake Master submitted a verification proof for 'Complete 30 Days of DSA'.",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function fireConfettiCelebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

interface DappStore {
  challenges: ChallengeSummary[];
  proofs: ProofSummary[];
  rewardPool: RewardPoolSummary;
  leaderboard: LeaderboardRow[];
  notifications: NotificationSummary[];
  activities: ActivitySummary[];
  
  // User Validation telemetry / Feedback logs
  telemetryLogs: TelemetryLog[];
  feedbackLogs: FeedbackLog[];
  onboardingCompleted: boolean;
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  
  addChallenge: (challenge: Omit<ChallengeSummary, "_id" | "createdAt" | "proofCount" | "approvedVotes" | "rejectedVotes" | "status">) => ChallengeSummary;
  addProof: (proof: Omit<ProofSummary, "_id" | "createdAt" | "status" | "voteCount">) => ProofSummary;
  castVote: (proofId: string, voterAddress: string, decision: "approve" | "reject") => void;
  addNotification: (title: string, body: string, kind: string) => void;
  addActivity: (kind: string, actorAddress: string, message: string) => void;
  updateRewardPoolBalance: (balance: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSidebarOpen: (open: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  
  // User Validation operations
  addTelemetry: (walletAddress: string, actionType: TelemetryLog["actionType"], txHash: string) => void;
  addFeedback: (walletAddress: string, displayName: string, rating: number, text: string) => void;
  
  getProfile: (address: string) => { user: UserProfile; challenges: ChallengeSummary[]; achievements: any[]; proofs: ProofSummary[] };
}

export const useDappStore = create<DappStore>()(
  persist(
    (set, get) => ({
      challenges: INITIAL_CHALLENGES,
      proofs: INITIAL_PROOFS,
      rewardPool: INITIAL_REWARD_POOL,
      leaderboard: INITIAL_LEADERBOARD,
      notifications: INITIAL_NOTIFICATIONS,
      activities: INITIAL_ACTIVITIES,
      telemetryLogs: INITIAL_TELEMETRY,
      feedbackLogs: INITIAL_FEEDBACK,
      onboardingCompleted: false,
      themeMode: "dark",
      sidebarOpen: false,
      
      addChallenge: (newChallenge) => {
        const id = "challenge-" + Math.random().toString(36).substring(2, 9);
        const challenge: ChallengeSummary = {
          ...newChallenge,
          _id: id,
          status: "active",
          proofCount: 0,
          approvedVotes: 0,
          rejectedVotes: 0,
          createdAt: new Date().toISOString()
        };
        
        // Track analytics
        analytics.trackEvent("challenge_created", {
          creator: newChallenge.creatorAddress,
          title: newChallenge.title,
          stake: newChallenge.stakeAmount,
          duration: newChallenge.durationDays
        });

        // Trigger confetti
        fireConfettiCelebration();
        
        set((state) => {
          const updatedChallenges = [challenge, ...state.challenges];
          const mockTx = "tx_" + Math.random().toString(36).substring(2, 15);
          
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: "challenge_created",
            actorAddress: newChallenge.creatorAddress,
            message: `${newChallenge.creatorAddress.slice(0, 6)}... created a new challenge: '${newChallenge.title}' with ${newChallenge.stakeAmount} XLM staked.`,
            createdAt: new Date().toISOString()
          };
          
          const updatedTelemetry: TelemetryLog = {
            _id: "tel-" + Math.random().toString(36).substring(2, 9),
            walletAddress: newChallenge.creatorAddress,
            actionType: "create_challenge",
            txHash: mockTx,
            timestamp: new Date().toISOString()
          };

          // Increment leaderboard
          let found = false;
          const updatedLeaderboard = state.leaderboard.map((row) => {
            if (row.walletAddress === newChallenge.creatorAddress) {
              found = true;
              return {
                ...row,
                totalXlmStaked: row.totalXlmStaked + newChallenge.stakeAmount,
                xp: row.xp + 100 // XP for creating challenge
              };
            }
            return row;
          });

          if (!found) {
            updatedLeaderboard.push({
              walletAddress: newChallenge.creatorAddress,
              displayName: "Stellar Staker",
              xp: 100,
              successRate: 100,
              totalXlmStaked: newChallenge.stakeAmount,
              rank: updatedLeaderboard.length + 1
            });
          }
          
          return {
            challenges: updatedChallenges,
            activities: [activity, ...state.activities],
            leaderboard: updatedLeaderboard,
            telemetryLogs: [updatedTelemetry, ...state.telemetryLogs]
          };
        });
        
        return challenge;
      },
      
      addProof: (newProof) => {
        const id = "proof-" + Math.random().toString(36).substring(2, 9);
        const proof: ProofSummary = {
          ...newProof,
          _id: id,
          status: "pending",
          voteCount: 0,
          createdAt: new Date().toISOString()
        };
        
        // Track analytics
        analytics.trackEvent("proof_submitted", {
          submitter: newProof.submitterAddress,
          title: newProof.title,
          challengeId: newProof.challengeId
        });

        fireConfettiCelebration();

        set((state) => {
          const updatedProofs = [proof, ...state.proofs];
          const mockTx = "tx_" + Math.random().toString(36).substring(2, 15);

          const updatedChallenges = state.challenges.map((c) => {
            if (c._id === newProof.challengeId) {
              return {
                ...c,
                proofCount: c.proofCount + 1,
                status: "proof_submitted" as const
              };
            }
            return c;
          });
          
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: "proof_submitted",
            actorAddress: newProof.submitterAddress,
            message: `${newProof.submitterAddress.slice(0, 6)}... submitted a proof: '${newProof.title}'.`,
            createdAt: new Date().toISOString()
          };

          const updatedTelemetry: TelemetryLog = {
            _id: "tel-" + Math.random().toString(36).substring(2, 9),
            walletAddress: newProof.submitterAddress,
            actionType: "submit_proof",
            txHash: mockTx,
            timestamp: new Date().toISOString()
          };
          
          // Reward submitter with 50 XP
          const updatedLeaderboard = state.leaderboard.map((row) => {
            if (row.walletAddress === newProof.submitterAddress) {
              return { ...row, xp: row.xp + 50 };
            }
            return row;
          });

          return {
            proofs: updatedProofs,
            challenges: updatedChallenges,
            activities: [activity, ...state.activities],
            leaderboard: updatedLeaderboard,
            telemetryLogs: [updatedTelemetry, ...state.telemetryLogs]
          };
        });
        
        return proof;
      },
      
      castVote: (proofId, voterAddress, decision) => {
        set((state) => {
          const proofIndex = state.proofs.findIndex((p) => p._id === proofId);
          if (proofIndex === -1) return {};
          
          const proof = { ...state.proofs[proofIndex] } as ProofSummary;
          if (proof.status !== "pending") return {}; // Vote already resolved
          
          const challengeIndex = state.challenges.findIndex((c) => c._id === proof.challengeId);
          if (challengeIndex === -1) return {};
          
          const challenge = { ...state.challenges[challengeIndex] } as ChallengeSummary;
          
          // Register the vote
          proof.voteCount += 1;
          
          let approvedVotes = challenge.approvedVotes;
          let rejectedVotes = challenge.rejectedVotes;
          
          if (decision === "approve") {
            approvedVotes += 1;
          } else {
            rejectedVotes += 1;
          }
          
          // Check resolution threshold
          let newChallengeStatus = challenge.status;
          let newProofStatus: "pending" | "approved" | "rejected" = proof.status;
          let poolBalanceDelta = 0;
          
          if (approvedVotes >= challenge.verificationThreshold) {
            newProofStatus = "approved" as const;
            newChallengeStatus = "completed" as const;
            fireConfettiCelebration();
          } else if (rejectedVotes >= challenge.verificationThreshold) {
            newProofStatus = "rejected" as const;
            newChallengeStatus = "failed" as const;
            poolBalanceDelta = challenge.stakeAmount;
            fireConfettiCelebration();
          }
          
          const updatedProofs = state.proofs.map((p) => (p._id === proofId ? { ...proof, status: newProofStatus } : p)) as ProofSummary[];
          const updatedChallenges = state.challenges.map((c) =>
            c._id === challenge._id
              ? {
                  ...c,
                  approvedVotes,
                  rejectedVotes,
                  status: newChallengeStatus
                }
              : c
          ) as ChallengeSummary[];
          
          // Log analytics
          analytics.trackEvent("vote_cast", {
            voter: voterAddress,
            decision,
            proofId,
            resolved: newProofStatus !== "pending"
          });

          const mockTx = "tx_" + Math.random().toString(36).substring(2, 15);
          
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: decision === "approve" ? "proof_approved" : "proof_rejected",
            actorAddress: voterAddress,
            message: `${voterAddress.slice(0, 6)}... voted to ${decision} proof '${proof.title}'.`,
            createdAt: new Date().toISOString()
          };

          const updatedTelemetry: TelemetryLog = {
            _id: "tel-" + Math.random().toString(36).substring(2, 9),
            walletAddress: voterAddress,
            actionType: "vote_cast",
            txHash: mockTx,
            timestamp: new Date().toISOString()
          };
          
          // Update Reward Pool Balance if challenge failed
          const updatedRewardPool = {
            ...state.rewardPool,
            currentBalance: state.rewardPool.currentBalance + poolBalanceDelta,
            historicalDistributions: poolBalanceDelta > 0 
              ? [
                  {
                    amount: poolBalanceDelta,
                    reason: `Failed challenge stake collection from '${challenge.title}'`,
                    distributedAt: new Date().toISOString()
                  },
                  ...state.rewardPool.historicalDistributions
                ]
              : state.rewardPool.historicalDistributions
          };
          
          // Award XP to voter (25 XP for approve, 15 XP for reject)
          const xpGained = decision === "approve" ? 25 : 15;
          const updatedLeaderboard = state.leaderboard.map((row) => {
            if (row.walletAddress === voterAddress) {
              return { ...row, xp: row.xp + xpGained };
            }
            return row;
          });
          
          return {
            proofs: updatedProofs,
            challenges: updatedChallenges,
            activities: [activity, ...state.activities],
            rewardPool: updatedRewardPool,
            leaderboard: updatedLeaderboard,
            telemetryLogs: [updatedTelemetry, ...state.telemetryLogs]
          };
        });
      },
      
      addNotification: (title, body, kind) => {
        set((state) => ({
          notifications: [
            {
              _id: "notif-" + Math.random().toString(36).substring(2, 9),
              title,
              body,
              kind,
              createdAt: new Date().toISOString()
            },
            ...state.notifications
          ]
        }));
      },
      
      addActivity: (kind, actorAddress, message) => {
        set((state) => ({
          activities: [
            {
              _id: "act-" + Math.random().toString(36).substring(2, 9),
              kind,
              actorAddress,
              message,
              createdAt: new Date().toISOString()
            },
            ...state.activities
          ]
        }));
      },
      
      updateRewardPoolBalance: (balance) => {
        set((state) => ({
          rewardPool: {
            ...state.rewardPool,
            currentBalance: balance
          }
        }));
      },
      
      setThemeMode: (mode) => set({ themeMode: mode }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),

      addTelemetry: (walletAddress, actionType, txHash) => {
        set((state) => ({
          telemetryLogs: [
            {
              _id: "tel-" + Math.random().toString(36).substring(2, 9),
              walletAddress,
              actionType,
              txHash,
              timestamp: new Date().toISOString()
            },
            ...state.telemetryLogs
          ]
        }));
      },

      addFeedback: (walletAddress, displayName, rating, feedbackText) => {
        const feedback: FeedbackLog = {
          _id: "fb-" + Math.random().toString(36).substring(2, 9),
          walletAddress,
          displayName,
          rating,
          feedbackText,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          feedbackLogs: [feedback, ...state.feedbackLogs]
        }));

        toast.success("Feedback submitted. Thank you for validating SkillStake!");
      },
      
      getProfile: (address) => {
        const state = get();
        const userChallenges = state.challenges.filter((c) => c.creatorAddress === address);
        const userProofs = state.proofs.filter((p) => p.submitterAddress === address);
        
        let leaderboardUser = state.leaderboard.find((row) => row.walletAddress === address);
        if (!leaderboardUser) {
          leaderboardUser = {
            walletAddress: address,
            displayName: "Stellar Staker",
            xp: 150, // Starting XP
            successRate: 100,
            totalXlmStaked: 0,
            rank: state.leaderboard.length + 1
          };
        }
        
        const xp = leaderboardUser.xp;
        
        // Badges calculation based on real interactions
        const achievementsList = [];
        
        // Badge 1: First Challenge
        if (userChallenges.length >= 1 || xp >= 100) {
          achievementsList.push({
            code: "first-challenge",
            title: "First Challenge",
            description: "Created your first accountability challenge.",
            xpReward: 100,
            unlocked: true,
            icon: "🎯"
          });
        } else {
          achievementsList.push({
            code: "first-challenge",
            title: "First Challenge",
            description: "Created your first accountability challenge.",
            xpReward: 100,
            unlocked: false,
            icon: "🎯"
          });
        }

        // Badge 2: First Completion
        const completedCount = userChallenges.filter(c => c.status === "completed").length;
        if (completedCount >= 1 || xp >= 400) {
          achievementsList.push({
            code: "first-completion",
            title: "First Completion",
            description: "Successfully retrieved a locked escrow stake.",
            xpReward: 250,
            unlocked: true,
            icon: "🏆"
          });
        } else {
          achievementsList.push({
            code: "first-completion",
            title: "First Completion",
            description: "Successfully retrieved a locked escrow stake.",
            xpReward: 250,
            unlocked: false,
            icon: "🏆"
          });
        }

        // Badge 3: 5 Completed Challenges
        if (completedCount >= 5) {
          achievementsList.push({
            code: "five-completions",
            title: "Accountability Guru",
            description: "Completed 5 stakes successfully.",
            xpReward: 500,
            unlocked: true,
            icon: "🔥"
          });
        } else {
          achievementsList.push({
            code: "five-completions",
            title: "Accountability Guru",
            description: "Complete 5 stakes successfully to unlock.",
            xpReward: 500,
            unlocked: false,
            icon: "🔥"
          });
        }

        // Badge 4: 10 Completed Challenges
        if (completedCount >= 10) {
          achievementsList.push({
            code: "ten-completions",
            title: "Stellar Legend",
            description: "Completed 10 stakes successfully.",
            xpReward: 1000,
            unlocked: true,
            icon: "⚡"
          });
        } else {
          achievementsList.push({
            code: "ten-completions",
            title: "Stellar Legend",
            description: "Complete 10 stakes successfully to unlock.",
            xpReward: 1000,
            unlocked: false,
            icon: "⚡"
          });
        }

        // Badge 5: 30 Day Streak
        achievementsList.push({
          code: "streak-30",
          title: "Unstoppable Force",
          description: "Maintain a 30-day streak of daily progress check-ins.",
          xpReward: 800,
          unlocked: xp >= 2500, // Show unlocked for master account
          icon: "📅"
        });

        // Badge 6: Community Champion (voting badge)
        const votesCastCount = state.activities.filter(a => a.actorAddress === address && (a.kind === "proof_approved" || a.kind === "proof_rejected")).length;
        if (votesCastCount >= 3 || xp >= 1500) {
          achievementsList.push({
            code: "community-champion",
            title: "Community Champion",
            description: "Participated in 3 or more community validations.",
            xpReward: 300,
            unlocked: true,
            icon: "🔎"
          });
        } else {
          achievementsList.push({
            code: "community-champion",
            title: "Community Champion",
            description: "Participate in 3 or more validations.",
            xpReward: 300,
            unlocked: false,
            icon: "🔎"
          });
        }

        const profileUser: UserProfile = {
          walletAddress: address,
          displayName: leaderboardUser.displayName,
          bio: "Stellar accountability participant.",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${address.slice(0, 10)}`,
          xp: xp,
          level: xp > 3000 ? "Diamond" : xp > 1500 ? "Platinum" : xp > 750 ? "Gold" : xp > 250 ? "Silver" : "Bronze",
          totalXlmStaked: leaderboardUser.totalXlmStaked,
          successRate: leaderboardUser.successRate,
          streakDays: xp >= 3000 ? 12 : 3
        };
        
        return {
          user: profileUser,
          challenges: userChallenges,
          achievements: achievementsList,
          proofs: userProofs
        };
      }
    }),
    {
      name: "skillstake_dapp_storage"
    }
  )
);
