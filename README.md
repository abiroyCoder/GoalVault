# ⚡ GoalVault

<div align="center">

**A Decentralized Goal Accountability Platform on Stellar Soroban**

*Lock XLM on goals. Prove it. Get rewarded. Forfeit — fund the community.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-goal--vault--stellar.netlify.app-1A6B3C?style=for-the-badge&logo=netlify)](https://goal-vault-stellar.netlify.app/)
[![Network](https://img.shields.io/badge/Network-Stellar_Testnet-1A6B3C?style=for-the-badge&logo=stellar)](https://stellar.expert/explorer/testnet)
[![Built for RiseIn](https://img.shields.io/badge/Built_for-RiseIn_Level_3-f59e0b?style=for-the-badge)](https://www.risein.com/)
[![License](https://img.shields.io/badge/License-MIT-stone?style=for-the-badge)](LICENSE)

</div>

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution](#solution)
3. [Why Stellar](#why-stellar)
4. [Architecture](#architecture)
5. [Smart Contract](#smart-contract)
6. [Tech Stack](#tech-stack)
7. [Features](#features)
8. [How It Works](#how-it-works)
9. [Getting Started](#getting-started)
10. [Environment Variables](#environment-variables)
11. [Author](#author)

---

## Problem Statement

Personal accountability is hard. Habit tracking apps have no real stakes — missing a workout or skipping a learning goal has zero financial consequence. This creates a commitment gap that traditional apps cannot close.

At the same time, existing accountability tools are:

- Centralized — a company holds your commitment fee and decides the outcome
- Opaque — no on-chain audit trail of proof or votes
- Slow to settle — payouts take days through bank transfers or third parties

GoalVault solves this with blockchain-enforced accountability.

---

## Solution

GoalVault is a decentralized accountability protocol where users stake XLM on personal goals. Smart contracts escrow the funds. When a user completes their goal, they submit proof (GitHub links, Strava activities, screenshots). The community votes. If the threshold is met, the stake is returned. If not, it flows to the Reward Vault and is distributed to active verifiers.

No middlemen. No chargebacks. No trust required.

---

## Why Stellar

GoalVault is built specifically for Stellar because:

- Soroban smart contracts enable complex escrow logic with low fees and fast finality
- XLM transactions settle in 3-5 seconds — no waiting for proof or payout
- Freighter and Albedo provide browser wallet support without custodial risk
- Stellar Testnet enables realistic development with zero cost
- The Stellar ecosystem aligns with financial inclusion — anyone with XLM can participate

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     GoalVault                        │
│                                                      │
│  Frontend (React + Vite + TypeScript)                │
│  ├── Landing Page (editorial hero)                   │
│  ├── Dashboard (charts, metrics)                     │
│  ├── Create Goal (escrow form)                       │
│  ├── Active Goals (browse + filter)                  │
│  ├── Reward Vault (treasury stats)                   │
│  ├── Hall of Proof (leaderboard)                     │
│  ├── Wallet (Freighter / Albedo)                     │
│  └── Auditor Panel (community verification)          │
│                                                      │
│  Soroban Smart Contract (Rust)                       │
│  ├── create_goal()   → lock XLM in escrow            │
│  ├── submit_proof()  → submit completion evidence    │
│  ├── approve_proof() → community vote to approve     │
│  ├── reject_proof()  → community vote to reject      │
│  ├── complete_goal() → return stake to creator       │
│  └── forfeit_goal()  → route stake to Reward Vault   │
│                                                      │
│  Stellar Testnet ←→ Soroban RPC                      │
└─────────────────────────────────────────────────────┘
```

---

## Smart Contract

The `GoalVaultContract` is written in Rust using the `soroban-sdk`. It manages the full lifecycle of a goal:

| Function | Description |
|---|---|
| `initialize()` | Set admin, vote threshold, XLM token address |
| `create_goal()` | Lock XLM collateral into escrow |
| `submit_proof()` | Upload completion evidence for review |
| `approve_proof()` | Cast a community approval vote |
| `reject_proof()` | Cast a community rejection vote |
| `complete_goal()` | Return stake to creator on success |
| `forfeit_goal()` | Route stake to Reward Vault on failure |
| `reward_vault_balance()` | Query community treasury balance |

Key design decisions:

- Self-voting is disallowed — creators and submitters cannot vote on their own proof
- Threshold voting — a configurable number of approvals triggers automatic settlement
- Immutable audit trail — every action emits a Soroban event on-chain
- Admin override — admin can manually complete or forfeit goals in edge cases

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TypeScript |
| Styling | Tailwind CSS (light editorial theme) |
| Charts | Recharts |
| Routing | React Router v7 |
| State | Zustand + TanStack Query |
| Animations | Framer Motion |
| Wallet | Freighter API, Albedo |
| Smart Contract | Rust, Soroban SDK |
| Network | Stellar Testnet |
| Monitoring | Sentry |
| Analytics | Vercel Analytics |
| Deployment | Netlify |

---

## Features

- Create goals with custom XLM stake, duration, and verification threshold
- Submit proof (GitHub, Strava, screenshots, text evidence)
- Community verification voting with anti-self-vote protection
- Automatic smart contract settlement on threshold
- Reward Vault — community treasury funded by forfeited stakes
- Hall of Proof — on-chain leaderboard sorted by XP, stake, or success rate
- Live analytics dashboard — area charts, pie chart, line chart, composed chart
- Freighter and Albedo wallet support
- Guided onboarding tour
- Fully responsive — desktop and mobile

---

## How It Works

```
1. Create Goal
   └── Define goal, set XLM stake, deadline, verification threshold
       └── XLM locked in Soroban escrow contract

2. Submit Proof
   └── Upload GitHub link / Strava / screenshot / text evidence
       └── Proof stored on-chain, community notified

3. Community Votes
   └── Peers review evidence and vote approve / reject
       └── Once threshold met, contract settles automatically

4. Settlement
   ├── Approved → stake returned to creator + XP earned
   └── Rejected → stake routed to Reward Vault for verifiers
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/abiroyCoder/GoalVault.git
cd GoalVault

# Install dependencies
npm install

# Start the frontend dev server
cd apps/web
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
cd apps/web
npm run build
```

---

## Environment Variables

Create `apps/web/.env.local`:

```env
# Soroban Contract ID (Stellar Testnet)
VITE_CONTRACT_ID=<your_deployed_contract_id>

# Stellar Testnet RPC
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Stellar Horizon
VITE_HORIZON_URL=https://horizon-testnet.stellar.org

# Sentry (optional)
VITE_SENTRY_DSN=<your_sentry_dsn>

# Network
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

---

## Author

**Abi Roy** — [@abiroyCoder](https://github.com/abiroyCoder) (abiroykarmakar543@gmail.com)

*Built for the [RiseIn Stellar dApp Development Program](https://www.risein.com/) — Level 3*
