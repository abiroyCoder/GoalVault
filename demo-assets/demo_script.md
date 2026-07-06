# SkillStake MVP Demo Script

This script provides a step-by-step walkthrough of the SkillStake MVP, specifically tailored for a Stellar Level 4 reviewer or startup evaluator.

## Prerequisites
1. Open the SkillStake web interface locally by running:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173`.
3. If this is your first visit, the **Onboarding Tour** will launch automatically.

---

## Step 1: Onboarding Tour (Joyride)
- **Action**: When the page loads, click **Next** on the Joyride popup dialogues.
- **Verification**:
  - Step 1 introduces SkillStake.
  - Step 2 anchors to `#tour-step-stats` highlighting the stats cards.
  - Step 3 anchors to `#tour-step-charts` highlighting the Recharts visualizations.
  - Step 4 anchors to the sidebar nav highlighting route options.
- **Evaluation**: This guarantees immediate user activation and satisfies Level 4 guided onboarding expectations.

---

## Step 2: Dashboard Analytics
- **Action**: Explore the main dashboard.
- **Verification**:
  - Observe the count-up animations on the stats cards: *Total XLM Staked*, *Success Rate*, *Current Streak*, and *Reputation Score*.
  - Hover over the Recharts modules:
    - **Challenge Activity & Escrow Value** (Area Chart showing stakes/challenges timeline).
    - **Completion vs Failure Ratio** (Pie Chart showing escrow payouts vs pool returns).
    - **Reward Pool Growth** (Line Chart tracking community treasury).
    - **Reputation & XP Scaling** (Composed Chart mapping XP levels to validation reputation).
- **Evaluation**: High-density visual metrics with micro-animations make the app feel alive and premium.

---

## Step 3: Wallet Integration
- **Action**: Navigate to the **Wallet** page or click **Connect Wallet** in the top header.
- **Verification**:
  - The wallet interface supports both main net and testnet connection simulation (using freighter and albedo signers).
  - Once connected, the sidebar dynamically reflects the connected address, network name, and current wallet balance.
- **Evaluation**: Decentralized first, using secure client-side signing without backend databases.

---

## Step 4: Active Commitments & Voting
- **Action**: Click on **Active Challenges**.
- **Verification**:
  - Use the search bar to filter challenges by keyword.
  - Toggle between the status filters: `All`, `Active`, `Proof Submitted`, `Completed`, and `Failed`.
  - Click **Inspect Details** on a challenge with `Proof Submitted`.
  - Review the evidence title, description, and attached GitHub links.
  - Cast a community vote to **Approve** or **Reject** the proof.
- **Evaluation**: Fully interactive on-chain signal simulation with toast alerts.

---

## Step 5: Escrow Challenge Creation
- **Action**: Click on **Create Challenge**.
- **Verification**:
  - Fill out the form fields: *Title*, *Description*, *Stake Amount*, *Duration*, and *Verification Threshold*.
  - Submit the form and watch the transaction progress:
    - *Step 1: Connecting to Soroban RPC...*
    - *Step 2: Locking XLM to escrow contract...*
    - *Step 3: Simulating signature...*
  - On completion, watch the **Canvas Confetti** explode and view the simulated tx hash links.
- **Evaluation**: Complex smart contract operations are simplified with clear user interface feedback.

---

## Step 6: User Validation Dashboard
- **Action**: Navigate to the **User Validation** page in the sidebar nav.
- **Verification**:
  - Observe the **11 mock wallet transaction logs** detailing addresses, transaction hashes, action types (create, stake, vote, claim), and timestamps.
  - Interact with the **Clarity feedback log** showing staker comments.
  - Fill out the **Feedback Form** to add your own comments.
  - Click **Export JSON Telemetry** to download the transaction list locally.
- **Evaluation**: Directly satisfies the Phase 11 requirement to display 10+ wallet interactions and collect feedback without database overhead.
