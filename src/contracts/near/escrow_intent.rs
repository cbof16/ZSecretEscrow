use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, PanicOnDefault, Promise};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum IntentStatus {
    Created,
    Approved,
    Disputed,
    Completed,
    Cancelled,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct EscrowIntent {
    intent_id: String,
    client: AccountId,
    freelancer: AccountId,
    amount: Balance,
    deadline: u64,
    description: String,
    proof_link: Option<String>,
    notes: Option<String>,
    status: IntentStatus,
    created_at: u64,
    updated_at: u64,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct EscrowIntentContract {
    pub owner_id: AccountId,
    pub intents: UnorderedMap<String, EscrowIntent>,
    pub user_intents: LookupMap<AccountId, Vec<String>>,
    pub total_intents: u64,
}

#[near_bindgen]
impl EscrowIntentContract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id,
            intents: UnorderedMap::new(b"i"),
            user_intents: LookupMap::new(b"u"),
            total_intents: 0,
        }
    }

    // Create a new escrow intent
    pub fn create_intent(
        &mut self,
        intent_id: String,
        freelancer: AccountId,
        amount: U128,
        deadline: u64,
        description: String,
    ) -> EscrowIntent {
        let client = env::predecessor_account_id();
        let current_timestamp = env::block_timestamp();

        let intent = EscrowIntent {
            intent_id: intent_id.clone(),
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount: amount.0,
            deadline,
            description,
            proof_link: None,
            notes: None,
            status: IntentStatus::Created,
            created_at: current_timestamp,
            updated_at: current_timestamp,
        };

        // Store the intent
        self.intents.insert(&intent_id, &intent);
        self.total_intents += 1;

        // Add reference to client's intents
        let mut client_intents = self.user_intents.get(&client).unwrap_or_else(|| Vec::new());
        client_intents.push(intent_id.clone());
        self.user_intents.insert(&client, &client_intents);

        // Add reference to freelancer's intents
        let mut freelancer_intents = self.user_intents.get(&freelancer).unwrap_or_else(|| Vec::new());
        freelancer_intents.push(intent_id);
        self.user_intents.insert(&freelancer, &freelancer_intents);

        intent
    }

    // Get intent by ID
    pub fn get_intent(&self, intent_id: String) -> Option<EscrowIntent> {
        self.intents.get(&intent_id)
    }

    // Get intents for a user
    pub fn get_user_intents(&self, account_id: AccountId) -> Vec<EscrowIntent> {
        self.user_intents
            .get(&account_id)
            .unwrap_or_else(|| Vec::new())
            .iter()
            .filter_map(|intent_id| self.intents.get(intent_id))
            .collect()
    }

    // Submit work as a freelancer
    pub fn submit_work(&mut self, intent_id: String, proof_link: String, notes: Option<String>) -> EscrowIntent {
        let account_id = env::predecessor_account_id();
        let mut intent = self.intents.get(&intent_id).expect("Intent not found");

        // Verify caller is the freelancer
        assert_eq!(
            intent.freelancer, account_id,
            "Only the freelancer can submit work"
        );
        assert_eq!(
            intent.status, IntentStatus::Created,
            "Intent must be in Created status"
        );

        // Update intent with proof and notes
        intent.proof_link = Some(proof_link);
        intent.notes = notes;
        intent.status = IntentStatus::Approved; // Auto-approve for now
        intent.updated_at = env::block_timestamp();

        // Store updated intent
        self.intents.insert(&intent_id, &intent);

        intent
    }

    // Approve work as a client
    pub fn approve_work(&mut self, intent_id: String) -> EscrowIntent {
        let account_id = env::predecessor_account_id();
        let mut intent = self.intents.get(&intent_id).expect("Intent not found");

        // Verify caller is the client
        assert_eq!(
            intent.client, account_id,
            "Only the client can approve work"
        );
        assert_eq!(
            intent.status, IntentStatus::Approved,
            "Intent must be in Approved status"
        );

        // Update intent status
        intent.status = IntentStatus::Completed;
        intent.updated_at = env::block_timestamp();

        // Store updated intent
        self.intents.insert(&intent_id, &intent);

        intent
    }

    // Dispute work as a client
    pub fn dispute_work(&mut self, intent_id: String) -> EscrowIntent {
        let account_id = env::predecessor_account_id();
        let mut intent = self.intents.get(&intent_id).expect("Intent not found");

        // Verify caller is the client
        assert_eq!(
            intent.client, account_id,
            "Only the client can dispute work"
        );
        assert_eq!(
            intent.status, IntentStatus::Approved,
            "Intent must be in Approved status"
        );

        // Update intent status
        intent.status = IntentStatus::Disputed;
        intent.updated_at = env::block_timestamp();

        // Store updated intent
        self.intents.insert(&intent_id, &intent);

        intent
    }

    // Cancel intent (only owner or client can cancel)
    pub fn cancel_intent(&mut self, intent_id: String) -> EscrowIntent {
        let account_id = env::predecessor_account_id();
        let mut intent = self.intents.get(&intent_id).expect("Intent not found");

        // Verify caller is the client or owner
        assert!(
            intent.client == account_id || self.owner_id == account_id,
            "Only the client or contract owner can cancel the intent"
        );
        assert!(
            intent.status == IntentStatus::Created || intent.status == IntentStatus::Disputed,
            "Intent can only be cancelled when in Created or Disputed status"
        );

        // Update intent status
        intent.status = IntentStatus::Cancelled;
        intent.updated_at = env::block_timestamp();

        // Store updated intent
        self.intents.insert(&intent_id, &intent);

        intent
    }

    // Admin resolve dispute (only owner can resolve disputes)
    pub fn resolve_dispute(&mut self, intent_id: String, complete: bool) -> EscrowIntent {
        let account_id = env::predecessor_account_id();
        let mut intent = self.intents.get(&intent_id).expect("Intent not found");

        // Verify caller is the owner
        assert_eq!(
            self.owner_id, account_id,
            "Only the contract owner can resolve disputes"
        );
        assert_eq!(
            intent.status, IntentStatus::Disputed,
            "Intent must be in Disputed status"
        );

        // Update intent status based on resolution
        if complete {
            intent.status = IntentStatus::Completed;
        } else {
            intent.status = IntentStatus::Cancelled;
        }
        intent.updated_at = env::block_timestamp();

        // Store updated intent
        self.intents.insert(&intent_id, &intent);

        intent
    }

    // Get total number of intents
    pub fn get_total_intents(&self) -> u64 {
        self.total_intents
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    #[test]
    fn test_create_intent() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = EscrowIntentContract::new(accounts(0));

        let intent = contract.create_intent(
            "intent1".to_string(),
            accounts(2),
            U128(1_000_000_000_000_000_000_000_000), // 1 NEAR
            0,
            "Test intent".to_string(),
        );

        assert_eq!(intent.intent_id, "intent1");
        assert_eq!(intent.client, accounts(1));
        assert_eq!(intent.freelancer, accounts(2));
        assert_eq!(intent.status, IntentStatus::Created);
        assert_eq!(contract.get_total_intents(), 1);
    }

    #[test]
    fn test_submit_work() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = EscrowIntentContract::new(accounts(0));

        contract.create_intent(
            "intent1".to_string(),
            accounts(2),
            U128(1_000_000_000_000_000_000_000_000), // 1 NEAR
            0,
            "Test intent".to_string(),
        );

        // Switch to freelancer account
        testing_env!(get_context(accounts(2)).build());

        let updated_intent = contract.submit_work(
            "intent1".to_string(),
            "https://proof.link".to_string(),
            Some("Work completed".to_string()),
        );

        assert_eq!(updated_intent.status, IntentStatus::Approved);
        assert_eq!(updated_intent.proof_link, Some("https://proof.link".to_string()));
        assert_eq!(updated_intent.notes, Some("Work completed".to_string()));
    }

    #[test]
    fn test_approve_work() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = EscrowIntentContract::new(accounts(0));

        contract.create_intent(
            "intent1".to_string(),
            accounts(2),
            U128(1_000_000_000_000_000_000_000_000), // 1 NEAR
            0,
            "Test intent".to_string(),
        );

        // Switch to freelancer account
        testing_env!(get_context(accounts(2)).build());

        contract.submit_work(
            "intent1".to_string(),
            "https://proof.link".to_string(),
            Some("Work completed".to_string()),
        );

        // Switch back to client account
        testing_env!(get_context(accounts(1)).build());

        let updated_intent = contract.approve_work("intent1".to_string());

        assert_eq!(updated_intent.status, IntentStatus::Completed);
    }

    #[test]
    fn test_dispute_work() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        let mut contract = EscrowIntentContract::new(accounts(0));

        contract.create_intent(
            "intent1".to_string(),
            accounts(2),
            U128(1_000_000_000_000_000_000_000_000), // 1 NEAR
            0,
            "Test intent".to_string(),
        );

        // Switch to freelancer account
        testing_env!(get_context(accounts(2)).build());

        contract.submit_work(
            "intent1".to_string(),
            "https://proof.link".to_string(),
            Some("Work completed".to_string()),
        );

        // Switch back to client account
        testing_env!(get_context(accounts(1)).build());

        let updated_intent = contract.dispute_work("intent1".to_string());

        assert_eq!(updated_intent.status, IntentStatus::Disputed);
    }
} 