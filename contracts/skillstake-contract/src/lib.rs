#![no_std]

//! GoalVault — Soroban Smart Contract
//!
//! A decentralized goal accountability escrow on Stellar.
//! Users lock XLM on goals, submit proof, community verifies,
//! and stakes are returned on success or routed to the Reward Vault on forfeit.

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    VerificationThreshold,
    Token,
    RewardVaultBalance,
    Counter,
    Goal(u64),
    Proof(u64),
    Vote(u64, Address),
}

#[contracttype]
#[derive(Clone)]
pub struct Goal {
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub stake_amount: i128,
    pub start_time: u64,
    pub end_time: u64,
    pub active: bool,
    pub completed: bool,
    pub forfeited: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Proof {
    pub goal_id: u64,
    pub submitter: Address,
    pub title: String,
    pub description: String,
    pub github_url: String,
    pub external_url: String,
    pub text_evidence: String,
    pub approved: bool,
    pub rejected: bool,
    pub approval_votes: u32,
    pub rejection_votes: u32,
}

#[contract]
pub struct GoalVaultContract;

#[contractimpl]
impl GoalVaultContract {
    /// Initialize the GoalVault contract with admin, vote threshold, and XLM token address.
    pub fn initialize(env: Env, admin: Address, verification_threshold: u32, token: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("GoalVault: already initialized");
        }
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::VerificationThreshold, &verification_threshold);
        env.storage().persistent().set(&DataKey::Token, &token);
        env.storage().persistent().set(&DataKey::RewardVaultBalance, &0i128);
        env.storage().persistent().set(&DataKey::Counter, &0u64);
    }

    pub fn admin(env: Env) -> Address {
        env.storage().persistent().get(&DataKey::Admin).expect("GoalVault: not initialized")
    }

    pub fn token(env: Env) -> Address {
        env.storage().persistent().get(&DataKey::Token).expect("GoalVault: not initialized")
    }

    /// Create a goal and lock XLM collateral into escrow.
    pub fn create_goal(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        stake_amount: i128,
        start_time: u64,
        end_time: u64,
    ) -> u64 {
        creator.require_auth();
        assert!(stake_amount > 0, "GoalVault: stake must be greater than zero");

        let token_address = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Token)
            .expect("GoalVault: not initialized");
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&creator, &env.current_contract_address(), &stake_amount);

        let id = Self::next_id(&env);
        let goal = Goal {
            creator: creator.clone(),
            title,
            description,
            stake_amount,
            start_time,
            end_time,
            active: true,
            completed: false,
            forfeited: false,
        };
        env.storage().persistent().set(&DataKey::Goal(id), &goal);
        env.events().publish(("goal_created", id), creator);
        id
    }

    /// Submit proof of goal completion for community review.
    pub fn submit_proof(
        env: Env,
        goal_id: u64,
        submitter: Address,
        title: String,
        description: String,
        github_url: String,
        external_url: String,
        text_evidence: String,
    ) -> u64 {
        submitter.require_auth();
        let goal = Self::get_goal(&env, goal_id);
        assert!(goal.active, "GoalVault: goal is not active");
        let id = Self::next_id(&env);
        let proof = Proof {
            goal_id,
            submitter: submitter.clone(),
            title,
            description,
            github_url,
            external_url,
            text_evidence,
            approved: false,
            rejected: false,
            approval_votes: 0,
            rejection_votes: 0,
        };
        env.storage().persistent().set(&DataKey::Proof(id), &proof);
        env.events().publish(("proof_submitted", id), submitter);
        id
    }

    /// Vote to approve proof — once threshold is met, stake is returned to creator.
    pub fn approve_proof(env: Env, proof_id: u64, voter: Address) {
        voter.require_auth();
        let mut proof = Self::get_proof(&env, proof_id);
        let goal = Self::get_goal(&env, proof.goal_id);
        assert!(
            voter != proof.submitter && voter != goal.creator,
            "GoalVault: self-voting not allowed"
        );
        assert!(!proof.approved && !proof.rejected, "GoalVault: vote already closed");
        Self::register_vote(&env, proof_id, &voter, true);
        proof.approval_votes += 1;
        if proof.approval_votes >= Self::verification_threshold(&env) {
            proof.approved = true;
            env.storage().persistent().set(&DataKey::Proof(proof_id), &proof);
            Self::complete_goal_internal(&env, proof.goal_id);
        } else {
            env.storage().persistent().set(&DataKey::Proof(proof_id), &proof);
        }
        env.events().publish(("proof_approved", proof_id), voter);
    }

    /// Vote to reject proof — once threshold is met, stake routes to Reward Vault.
    pub fn reject_proof(env: Env, proof_id: u64, voter: Address) {
        voter.require_auth();
        let mut proof = Self::get_proof(&env, proof_id);
        let goal = Self::get_goal(&env, proof.goal_id);
        assert!(
            voter != proof.submitter && voter != goal.creator,
            "GoalVault: self-voting not allowed"
        );
        assert!(!proof.approved && !proof.rejected, "GoalVault: vote already closed");
        Self::register_vote(&env, proof_id, &voter, false);
        proof.rejection_votes += 1;
        if proof.rejection_votes >= Self::verification_threshold(&env) {
            proof.rejected = true;
            env.storage().persistent().set(&DataKey::Proof(proof_id), &proof);
            Self::forfeit_goal_internal(&env, proof.goal_id);
        } else {
            env.storage().persistent().set(&DataKey::Proof(proof_id), &proof);
        }
        env.events().publish(("proof_rejected", proof_id), voter);
    }

    /// Admin can manually complete a goal (emergency / override).
    pub fn complete_goal(env: Env, goal_id: u64) {
        let admin = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Admin)
            .expect("GoalVault: not initialized");
        admin.require_auth();
        Self::complete_goal_internal(&env, goal_id);
    }

    /// Admin can manually forfeit a goal (expired, no proof).
    pub fn forfeit_goal(env: Env, goal_id: u64) {
        let admin = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Admin)
            .expect("GoalVault: not initialized");
        admin.require_auth();
        Self::forfeit_goal_internal(&env, goal_id);
    }

    pub fn reward_vault_balance(env: Env) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::RewardVaultBalance)
            .unwrap_or(0i128)
    }

    pub fn goal(env: Env, id: u64) -> Goal {
        Self::get_goal(&env, id)
    }

    pub fn proof(env: Env, id: u64) -> Proof {
        Self::get_proof(&env, id)
    }

    // ── Internal Helpers ─────────────────────────────────────────────────────

    fn verification_threshold(env: &Env) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::VerificationThreshold)
            .unwrap_or(3u32)
    }

    fn next_id(env: &Env) -> u64 {
        let current = env.storage().persistent().get(&DataKey::Counter).unwrap_or(0u64);
        env.storage().persistent().set(&DataKey::Counter, &(current + 1));
        current + 1
    }

    fn register_vote(env: &Env, proof_id: u64, voter: &Address, approved: bool) {
        let key = DataKey::Vote(proof_id, voter.clone());
        assert!(
            env.storage().persistent().get::<_, bool>(&key).is_none(),
            "GoalVault: duplicate vote"
        );
        env.storage().persistent().set(&key, &approved);
    }

    fn get_goal(env: &Env, id: u64) -> Goal {
        env.storage()
            .persistent()
            .get(&DataKey::Goal(id))
            .expect("GoalVault: goal not found")
    }

    fn get_proof(env: &Env, id: u64) -> Proof {
        env.storage()
            .persistent()
            .get(&DataKey::Proof(id))
            .expect("GoalVault: proof not found")
    }

    /// On success: stake is returned to the goal creator.
    fn complete_goal_internal(env: &Env, goal_id: u64) {
        let mut goal = Self::get_goal(env, goal_id);
        assert!(goal.active, "GoalVault: goal is not active");
        goal.active = false;
        goal.completed = true;
        env.storage().persistent().set(&DataKey::Goal(goal_id), &goal);

        let token_address = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Token)
            .expect("GoalVault: not initialized");
        let token_client = token::Client::new(env, &token_address);
        token_client.transfer(&env.current_contract_address(), &goal.creator, &goal.stake_amount);

        env.events().publish(("goal_completed", goal_id), goal.creator);
    }

    /// On forfeit: stake routes to the Reward Vault (admin treasury).
    fn forfeit_goal_internal(env: &Env, goal_id: u64) {
        let mut goal = Self::get_goal(env, goal_id);
        assert!(goal.active, "GoalVault: goal is not active");
        goal.active = false;
        goal.forfeited = true;
        env.storage().persistent().set(&DataKey::Goal(goal_id), &goal);

        let new_vault_balance = Self::reward_vault_balance(env.clone()) + goal.stake_amount;
        env.storage()
            .persistent()
            .set(&DataKey::RewardVaultBalance, &new_vault_balance);

        let token_address = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Token)
            .expect("GoalVault: not initialized");
        let token_client = token::Client::new(env, &token_address);
        let admin = env
            .storage()
            .persistent()
            .get::<_, Address>(&DataKey::Admin)
            .expect("GoalVault: not initialized");
        token_client.transfer(&env.current_contract_address(), &admin, &goal.stake_amount);

        env.events().publish(("goal_forfeited", goal_id), goal.creator);
    }
}

#[cfg(test)]
mod test;
