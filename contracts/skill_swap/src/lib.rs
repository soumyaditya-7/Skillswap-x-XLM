#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, Symbol, Vec,
    token, symbol_short,
};

// ─────────────────────────────────────────
// Error codes — stored as plain u32
// ─────────────────────────────────────────
pub mod errors {
    pub const NOT_FOUND      : u32 = 1;
    pub const UNAUTHORIZED   : u32 = 2;
    pub const INVALID_STATUS : u32 = 3;
    pub const TEAM_FULL      : u32 = 4;
    pub const ALREADY_MEMBER : u32 = 5;
    pub const INVALID_SCORE  : u32 = 6;
    pub const NOT_MEMBER     : u32 = 7;
}

// ─────────────────────────────────────────
// Data Keys
// ─────────────────────────────────────────
#[contracttype]
pub enum DataKey {
    ListingCount,
    SessionCount,
    TeamCount,
    Listing(u64),
    Session(u64),
    Team(u64),
    TeamMembers(u64),
    TeamStake(u64, Address),
    Reputation(Address),
    Admin,
    XlmToken,
}

// ─────────────────────────────────────────
// Data Structs
// ─────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub struct Listing {
    pub id:           u64,
    pub poster:       Address,
    pub skill_offer:  String,
    pub skill_want:   String,
    pub level_offer:  Symbol,
    pub level_want:   Symbol,
    pub status:       Symbol,
    pub has_matcher:  bool,
    pub matcher:      Address,
    pub created_at:   u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Session {
    pub id:         u64,
    pub learner:    Address,
    pub mentor:     Address,
    pub amount:     i128,
    pub status:     Symbol,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Team {
    pub id:             u64,
    pub name:           String,
    pub creator:        Address,
    pub required_stake: i128,
    pub max_members:    u32,
    pub status:         Symbol,
    pub created_at:     u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Reputation {
    pub total_score:  u32,
    pub review_count: u32,
}

// ─────────────────────────────────────────
// Status constants (all <= 9 chars)
// ─────────────────────────────────────────
fn s_open()      -> Symbol { symbol_short!("open")      }
fn s_pending()   -> Symbol { symbol_short!("pending")   }
fn s_matched()   -> Symbol { symbol_short!("matched")   }
fn s_completed() -> Symbol { symbol_short!("completed") }
fn s_cancelled() -> Symbol { symbol_short!("cancelled") }
fn s_booked()    -> Symbol { symbol_short!("booked")    }
fn s_confirmed() -> Symbol { symbol_short!("confirmed") }
fn s_disputed()  -> Symbol { symbol_short!("disputed")  }
fn s_refunded()  -> Symbol { symbol_short!("refunded")  }
fn s_active()    -> Symbol { symbol_short!("active")    }
fn s_closed()    -> Symbol { symbol_short!("closed")    }

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
fn next_id(env: &Env, key: DataKey) -> u64 {
    let id: u64 = env.storage().instance().get(&key).unwrap_or(0) + 1;
    env.storage().instance().set(&key, &id);
    id
}

fn get_xlm(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::XlmToken).expect("not init")
}

fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).expect("not init")
}

// ─────────────────────────────────────────
// Contract
// ─────────────────────────────────────────
#[contract]
pub struct SkillSwapContract;

#[contractimpl]
impl SkillSwapContract {

    // ══════════════════════════════════════
    // INITIALIZE
    // ══════════════════════════════════════

    pub fn initialize(env: Env, admin: Address, xlm_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialised");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::XlmToken, &xlm_token);
        env.storage().instance().extend_ttl(100_000, 100_000);
    }

    // ══════════════════════════════════════
    // SKILL EXCHANGE
    // ══════════════════════════════════════

    /// Post a new skill-exchange listing. Returns listing ID.
    pub fn list_skill(
        env: Env,
        poster: Address,
        skill_offer: String,
        skill_want: String,
        level_offer: Symbol,
        level_want: Symbol,
    ) -> u64 {
        poster.require_auth();
        let id = next_id(&env, DataKey::ListingCount);
        // Use a dummy address as placeholder for 'no matcher yet'
        let placeholder = poster.clone();
        let listing = Listing {
            id,
            poster: poster.clone(),
            skill_offer,
            skill_want,
            level_offer,
            level_want,
            status: s_open(),
            has_matcher: false,
            matcher: placeholder,
            created_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Listing(id), &listing);
        env.storage().persistent().extend_ttl(&DataKey::Listing(id), 50_000, 50_000);
        id
    }

    /// Matcher requests to swap with a listing.
    pub fn request_swap(env: Env, matcher: Address, listing_id: u64) {
        matcher.require_auth();
        let mut listing: Listing = env.storage().persistent()
            .get(&DataKey::Listing(listing_id))
            .unwrap_or_else(|| panic!("listing not found"));

        if listing.status != s_open() { panic!("listing not open"); }
        if listing.poster == matcher  { panic!("cannot request own listing"); }

        listing.matcher     = matcher;
        listing.has_matcher = true;
        listing.status      = s_pending();
        env.storage().persistent().set(&DataKey::Listing(listing_id), &listing);
    }

    /// Poster accepts the swap request.
    pub fn accept_swap(env: Env, poster: Address, listing_id: u64) {
        poster.require_auth();
        let mut listing: Listing = env.storage().persistent()
            .get(&DataKey::Listing(listing_id))
            .unwrap_or_else(|| panic!("listing not found"));

        if listing.poster != poster          { panic!("not the poster"); }
        if listing.status != s_pending()     { panic!("no pending request"); }

        listing.status = s_matched();
        env.storage().persistent().set(&DataKey::Listing(listing_id), &listing);
    }

    /// Either party marks the swap as completed.
    pub fn complete_swap(env: Env, caller: Address, listing_id: u64) {
        caller.require_auth();
        let mut listing: Listing = env.storage().persistent()
            .get(&DataKey::Listing(listing_id))
            .unwrap_or_else(|| panic!("listing not found"));

        let is_poster  = listing.poster == caller;
        let is_matcher = listing.has_matcher && listing.matcher == caller;
        if !is_poster && !is_matcher { panic!("not a party to this swap"); }
        if listing.status != s_matched()     { panic!("not matched"); }

        listing.status = s_completed();
        env.storage().persistent().set(&DataKey::Listing(listing_id), &listing);
    }

    /// Cancel an open listing (poster only).
    pub fn cancel_listing(env: Env, poster: Address, listing_id: u64) {
        poster.require_auth();
        let mut listing: Listing = env.storage().persistent()
            .get(&DataKey::Listing(listing_id))
            .unwrap_or_else(|| panic!("listing not found"));

        if listing.poster != poster { panic!("not the poster"); }
        if listing.status == s_completed() || listing.status == s_cancelled() {
            panic!("cannot cancel completed/cancelled listing");
        }
        listing.status = s_cancelled();
        env.storage().persistent().set(&DataKey::Listing(listing_id), &listing);
    }

    /// Read a listing by ID.
    pub fn get_listing(env: Env, listing_id: u64) -> Listing {
        env.storage().persistent()
            .get(&DataKey::Listing(listing_id))
            .unwrap_or_else(|| panic!("listing not found"))
    }

    // ══════════════════════════════════════
    // SESSION BOOKING (Escrow)
    // ══════════════════════════════════════

    /// Learner books a session — locks XLM in contract escrow. Returns session ID.
    pub fn book_session(
        env: Env,
        learner: Address,
        mentor: Address,
        amount_xlm: i128,
    ) -> u64 {
        learner.require_auth();
        if amount_xlm <= 0 { panic!("amount must be positive"); }

        let amount_stroops = amount_xlm * 10_000_000_i128;
        let token_client = token::Client::new(&env, &get_xlm(&env));
        token_client.transfer(&learner, &env.current_contract_address(), &amount_stroops);

        let id = next_id(&env, DataKey::SessionCount);
        let session = Session {
            id,
            learner: learner.clone(),
            mentor:  mentor.clone(),
            amount:  amount_stroops,
            status:  s_booked(),
            created_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Session(id), &session);
        env.storage().persistent().extend_ttl(&DataKey::Session(id), 50_000, 50_000);
        id
    }

    /// Mentor confirms session delivered — releases escrow to mentor.
    pub fn confirm_session(env: Env, mentor: Address, session_id: u64) {
        mentor.require_auth();
        let mut session: Session = env.storage().persistent()
            .get(&DataKey::Session(session_id))
            .unwrap_or_else(|| panic!("session not found"));

        if session.mentor != mentor      { panic!("not the mentor"); }
        if session.status != s_booked()  { panic!("session not booked"); }

        let token_client = token::Client::new(&env, &get_xlm(&env));
        token_client.transfer(&env.current_contract_address(), &mentor, &session.amount);

        session.status = s_confirmed();
        env.storage().persistent().set(&DataKey::Session(session_id), &session);
    }

    /// Learner raises a dispute.
    pub fn dispute_session(env: Env, learner: Address, session_id: u64) {
        learner.require_auth();
        let mut session: Session = env.storage().persistent()
            .get(&DataKey::Session(session_id))
            .unwrap_or_else(|| panic!("session not found"));

        if session.learner != learner    { panic!("not the learner"); }
        if session.status != s_booked()  { panic!("session not booked"); }

        session.status = s_disputed();
        env.storage().persistent().set(&DataKey::Session(session_id), &session);
    }

    /// Admin resolves a dispute. If refund_to_learner = true → refund. Else → pay mentor.
    pub fn resolve_dispute(env: Env, session_id: u64, refund_to_learner: bool) {
        let admin = get_admin(&env);
        admin.require_auth();

        let mut session: Session = env.storage().persistent()
            .get(&DataKey::Session(session_id))
            .unwrap_or_else(|| panic!("session not found"));

        if session.status != s_disputed() { panic!("session not disputed"); }

        let token_client = token::Client::new(&env, &get_xlm(&env));
        if refund_to_learner {
            token_client.transfer(&env.current_contract_address(), &session.learner, &session.amount);
            session.status = s_refunded();
        } else {
            token_client.transfer(&env.current_contract_address(), &session.mentor, &session.amount);
            session.status = s_confirmed();
        }
        env.storage().persistent().set(&DataKey::Session(session_id), &session);
    }

    /// Read a session by ID.
    pub fn get_session(env: Env, session_id: u64) -> Session {
        env.storage().persistent()
            .get(&DataKey::Session(session_id))
            .unwrap_or_else(|| panic!("session not found"))
    }

    // ══════════════════════════════════════
    // TEAM FORMATION (Stake-based)
    // ══════════════════════════════════════

    /// Creator creates a team. Returns team ID.
    pub fn create_team(
        env: Env,
        creator: Address,
        name: String,
        required_stake_xlm: i128,
        max_members: u32,
    ) -> u64 {
        creator.require_auth();
        if required_stake_xlm <= 0 { panic!("stake must be positive"); }
        if max_members == 0        { panic!("max_members must be > 0"); }

        let id = next_id(&env, DataKey::TeamCount);
        let team = Team {
            id,
            name,
            creator: creator.clone(),
            required_stake: required_stake_xlm * 10_000_000_i128,
            max_members,
            status: s_open(),
            created_at: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Team(id), &team);
        env.storage().persistent().extend_ttl(&DataKey::Team(id), 50_000, 50_000);

        let members: Vec<Address> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::TeamMembers(id), &members);
        id
    }

    /// Member joins a team by staking the required XLM.
    pub fn join_team(env: Env, member: Address, team_id: u64) {
        member.require_auth();
        let team: Team = env.storage().persistent()
            .get(&DataKey::Team(team_id))
            .unwrap_or_else(|| panic!("team not found"));

        if team.status != s_open() { panic!("team not open"); }

        let mut members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id))
            .unwrap_or_else(|| Vec::new(&env));

        if members.len() >= team.max_members { panic!("team is full"); }

        // Check already a member
        for m in members.iter() {
            if m == member { panic!("already a member"); }
        }

        // Transfer stake
        let token_client = token::Client::new(&env, &get_xlm(&env));
        token_client.transfer(&member, &env.current_contract_address(), &team.required_stake);

        env.storage().persistent().set(
            &DataKey::TeamStake(team_id, member.clone()),
            &team.required_stake,
        );

        members.push_back(member);
        env.storage().persistent().set(&DataKey::TeamMembers(team_id), &members);
    }

    /// Member leaves a team and gets stake refunded (only when team is "open").
    pub fn leave_team(env: Env, member: Address, team_id: u64) {
        member.require_auth();
        let team: Team = env.storage().persistent()
            .get(&DataKey::Team(team_id))
            .unwrap_or_else(|| panic!("team not found"));

        if team.status != s_open() { panic!("team is not open; stakes are locked"); }

        let mut members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id))
            .unwrap_or_else(|| panic!("team members not found"));

        // Find index of member
        let mut idx_opt: Option<u32> = None;
        for (i, m) in members.iter().enumerate() {
            if m == member { idx_opt = Some(i as u32); break; }
        }
        let idx = idx_opt.unwrap_or_else(|| panic!("not a member"));
        members.remove(idx);
        env.storage().persistent().set(&DataKey::TeamMembers(team_id), &members);

        // Refund stake
        let key = DataKey::TeamStake(team_id, member.clone());
        let stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        if stake > 0 {
            let token_client = token::Client::new(&env, &get_xlm(&env));
            token_client.transfer(&env.current_contract_address(), &member, &stake);
            env.storage().persistent().remove(&key);
        }
    }

    /// Creator activates the team — locks membership, no refunds after this.
    pub fn activate_team(env: Env, creator: Address, team_id: u64) {
        creator.require_auth();
        let mut team: Team = env.storage().persistent()
            .get(&DataKey::Team(team_id))
            .unwrap_or_else(|| panic!("team not found"));

        if team.creator != creator  { panic!("not the creator"); }
        if team.status  != s_open() { panic!("team not open");   }

        team.status = s_active();
        env.storage().persistent().set(&DataKey::Team(team_id), &team);
    }

    /// Creator closes the team — refunds all stakes to every member.
    pub fn close_team(env: Env, creator: Address, team_id: u64) {
        creator.require_auth();
        let mut team: Team = env.storage().persistent()
            .get(&DataKey::Team(team_id))
            .unwrap_or_else(|| panic!("team not found"));

        if team.creator != creator     { panic!("not the creator"); }
        if team.status  == s_closed()  { panic!("team already closed"); }

        let members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id))
            .unwrap_or_else(|| Vec::new(&env));

        let token_client = token::Client::new(&env, &get_xlm(&env));
        for m in members.iter() {
            let key = DataKey::TeamStake(team_id, m.clone());
            let stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
            if stake > 0 {
                token_client.transfer(&env.current_contract_address(), &m, &stake);
                env.storage().persistent().remove(&key);
            }
        }
        team.status = s_closed();
        env.storage().persistent().set(&DataKey::Team(team_id), &team);
    }

    /// Read a team by ID.
    pub fn get_team(env: Env, team_id: u64) -> Team {
        env.storage().persistent()
            .get(&DataKey::Team(team_id))
            .unwrap_or_else(|| panic!("team not found"))
    }

    /// Get all members of a team.
    pub fn get_team_members(env: Env, team_id: u64) -> Vec<Address> {
        env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id))
            .unwrap_or_else(|| Vec::new(&env))
    }

    // ══════════════════════════════════════
    // REPUTATION
    // ══════════════════════════════════════

    /// Rate a user 1–5 stars.
    pub fn rate_user(env: Env, rater: Address, target: Address, score: u32) {
        rater.require_auth();
        if score < 1 || score > 5 { panic!("score must be 1-5"); }
        if rater == target         { panic!("cannot rate yourself"); }

        let key = DataKey::Reputation(target.clone());
        let mut rep: Reputation = env.storage().persistent()
            .get(&key)
            .unwrap_or(Reputation { total_score: 0, review_count: 0 });

        rep.total_score  += score;
        rep.review_count += 1;
        env.storage().persistent().set(&key, &rep);
        env.storage().persistent().extend_ttl(&key, 50_000, 50_000);
    }

    /// Returns (total_score, review_count). Average = total_score / review_count.
    pub fn get_reputation(env: Env, user: Address) -> Reputation {
        env.storage().persistent()
            .get(&DataKey::Reputation(user))
            .unwrap_or(Reputation { total_score: 0, review_count: 0 })
    }

    // ══════════════════════════════════════
    // ADMIN
    // ══════════════════════════════════════

    /// Transfer admin role to a new address.
    pub fn transfer_admin(env: Env, current_admin: Address, new_admin: Address) {
        current_admin.require_auth();
        let stored = get_admin(&env);
        if stored != current_admin { panic!("not admin"); }
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }

    /// Returns the current admin address.
    pub fn get_admin(env: Env) -> Address {
        get_admin(&env)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, Address, String, symbol_short};

    fn setup() -> (Env, SkillSwapContractClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SkillSwapContract);
        let client = SkillSwapContractClient::new(&env, &contract_id);

        let admin    = Address::generate(&env);
        let xlm_id   = env.register_stellar_asset_contract_v2(admin.clone());
        let xlm_addr = xlm_id.address();

        client.initialize(&admin, &xlm_addr);
        (env, client, admin, xlm_addr)
    }

    fn mint(env: &Env, xlm_addr: &Address, to: &Address, xlm: i128) {
        let admin: Address = env.storage().instance()
            .get(&DataKey::Admin)
            .unwrap();
        soroban_sdk::token::StellarAssetClient::new(env, xlm_addr)
            .mint(to, &(xlm * 10_000_000_i128));
        let _ = admin;
    }

    #[test]
    fn test_list_and_complete_swap() {
        let (env, client, _admin, _xlm) = setup();
        let alice = Address::generate(&env);
        let bob   = Address::generate(&env);

        let id = client.list_skill(
            &alice,
            &String::from_str(&env, "React"),
            &String::from_str(&env, "Design"),
            &symbol_short!("advanced"),
            &symbol_short!("beginner"),
        );
        assert_eq!(id, 1);

        client.request_swap(&bob,   &id);
        client.accept_swap(&alice,  &id);
        client.complete_swap(&alice, &id);

        let listing = client.get_listing(&id);
        assert_eq!(listing.status, symbol_short!("completed"));
    }

    #[test]
    fn test_book_and_confirm_session() {
        let (env, client, _admin, xlm_addr) = setup();
        let learner = Address::generate(&env);
        let mentor  = Address::generate(&env);

        soroban_sdk::token::StellarAssetClient::new(&env, &xlm_addr)
            .mint(&learner, &(100 * 10_000_000_i128));

        let sid = client.book_session(&learner, &mentor, &10_i128);
        let s = client.get_session(&sid);
        assert_eq!(s.status, symbol_short!("booked"));

        client.confirm_session(&mentor, &sid);
        let s2 = client.get_session(&sid);
        assert_eq!(s2.status, symbol_short!("confirmed"));
    }

    #[test]
    fn test_team_join_and_leave() {
        let (env, client, _admin, xlm_addr) = setup();
        let creator = Address::generate(&env);
        let alice   = Address::generate(&env);

        soroban_sdk::token::StellarAssetClient::new(&env, &xlm_addr)
            .mint(&alice, &(100 * 10_000_000_i128));

        let tid = client.create_team(
            &creator,
            &String::from_str(&env, "DeFi Dashboard"),
            &5_i128,
            &4_u32,
        );

        client.join_team(&alice, &tid);
        assert_eq!(client.get_team_members(&tid).len(), 1);

        client.leave_team(&alice, &tid);
        assert_eq!(client.get_team_members(&tid).len(), 0);
    }

    #[test]
    fn test_reputation() {
        let (env, client, _admin, _xlm) = setup();
        let alice = Address::generate(&env);
        let bob   = Address::generate(&env);

        client.rate_user(&alice, &bob, &5_u32);
        client.rate_user(&alice, &bob, &4_u32);

        let rep = client.get_reputation(&bob);
        assert_eq!(rep.total_score,  9);
        assert_eq!(rep.review_count, 2);
    }

    #[test]
    fn test_cancel_listing() {
        let (env, client, _admin, _xlm) = setup();
        let alice = Address::generate(&env);

        let id = client.list_skill(
            &alice,
            &String::from_str(&env, "Python"),
            &String::from_str(&env, "Rust"),
            &symbol_short!("advanced"),
            &symbol_short!("beginner"),
        );

        client.cancel_listing(&alice, &id);
        let listing = client.get_listing(&id);
        assert_eq!(listing.status, symbol_short!("cancelled"));
    }
}
