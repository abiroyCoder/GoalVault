use super::{Goal, DataKey, GoalVaultContract, GoalVaultContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env, String, token};

fn setup() -> (Env, Address, Address, Address, token::Client<'static>, GoalVaultContractClient<'static>) {
    let env = Env::default();
    env.mock_all_auths();
    
    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let voter = Address::generate(&env);
    
    let token_admin = Address::generate(&env);
    let token_address = env.register_stellar_asset_contract(token_admin);
    let token_client = token::Client::new(&env, &token_address);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_address);
    
    // Mint initial balance to creator to allow staking
    token_admin_client.mint(&creator, &1000);
    
    let contract_id = env.register(GoalVaultContract, ());
    let client = GoalVaultContractClient::new(&env, &contract_id);
    client.initialize(&admin, &3, &token_address);
    
    (env, admin, creator, voter, token_client, client)
}

#[test]
fn test_create_and_complete_goal() {
    let (env, _admin, creator, voter, token_client, client) = setup();
    
    assert_eq!(token_client.balance(&creator), 1000);
    
    let goal_id = client.create_goal(
        &creator, 
        &String::from_str(&env, "30 Days of DSA"), 
        &String::from_str(&env, "Finish thirty days of practice."), 
        &100, 
        &0, 
        &1000
    );
    assert_eq!(goal_id, 1);
    assert_eq!(token_client.balance(&creator), 900);

    let proof_id = client.submit_proof(
        &goal_id, 
        &creator, 
        &String::from_str(&env, "Proof"), 
        &String::from_str(&env, "Evidence"), 
        &String::from_str(&env, ""), 
        &String::from_str(&env, ""), 
        &String::from_str(&env, "Evidence text")
    );
    assert_eq!(proof_id, 2);

    let voter2 = Address::generate(&env);
    let voter3 = Address::generate(&env);
    client.approve_proof(&proof_id, &voter);
    client.approve_proof(&proof_id, &voter2);
    client.approve_proof(&proof_id, &voter3);

    let goal = client.goal(&goal_id);
    assert!(goal.completed);
    assert_eq!(token_client.balance(&creator), 1000);
}

#[test]
fn test_fail_moves_stake_to_reward_vault() {
    let (env, admin, creator, voter, token_client, client) = setup();
    
    let goal_id = client.create_goal(
        &creator, 
        &String::from_str(&env, "Study 100 Hours"), 
        &String::from_str(&env, "Study intensely."), 
        &250, 
        &0, 
        &1000
    );
    let proof_id = client.submit_proof(
        &goal_id, 
        &creator, 
        &String::from_str(&env, "Proof"), 
        &String::from_str(&env, "Evidence"), 
        &String::from_str(&env, ""), 
        &String::from_str(&env, ""), 
        &String::from_str(&env, "Evidence text")
    );

    let voter2 = Address::generate(&env);
    let voter3 = Address::generate(&env);
    client.reject_proof(&proof_id, &voter);
    client.reject_proof(&proof_id, &voter2);
    client.reject_proof(&proof_id, &voter3);

    let goal = client.goal(&goal_id);
    assert!(goal.forfeited);
    assert_eq!(token_client.balance(&creator), 750);
    assert_eq!(token_client.balance(&admin), 250);
    assert_eq!(client.reward_vault_balance(), 250);
}

#[test]
fn test_admin_manual_override() {
    let (env, admin, creator, _voter, token_client, client) = setup();
    
    let goal_id = client.create_goal(
        &creator, 
        &String::from_str(&env, "Goal"), 
        &String::from_str(&env, "Desc"), 
        &100, 
        &0, 
        &1000
    );

    // Admin manually forfeits
    client.forfeit_goal(&goal_id);
    let goal = client.goal(&goal_id);
    assert!(goal.forfeited);
    assert_eq!(token_client.balance(&admin), 100);
}
