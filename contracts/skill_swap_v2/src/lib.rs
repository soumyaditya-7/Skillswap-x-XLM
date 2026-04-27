#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, Symbol, Vec, token, symbol_short,
};

// ─────────────────────────────────────────
// DATA KEYS
// ─────────────────────────────────────────
#[contracttype]
pub enum DataKey {
    Admin,
    XlmToken,
    SwapCount,
    SessionCount,
    TeamCount,
    DisputeCount,
    Swap(u64),
    SwapStake(u64, Address),
    Session(u64),
    SessionMilestone(u64, u32),
    Team(u64),
    TeamMembers(u64),
    TeamStake(u64, Address),
    TeamCheckin(u64, Address),
    Reputation(Address),
    Dispute(u64),
    LastActive(u64, Address),
}

// ─────────────────────────────────────────
// STRUCTS
// ─────────────────────────────────────────
#[contracttype] #[derive(Clone)]
pub struct Swap {
    pub id:          u64,
    pub poster:      Address,
    pub matcher:     Address,
    pub has_matcher: bool,
    pub skill_offer: String,
    pub skill_want:  String,
    pub stake:       i128,      // both sides deposit this
    pub status:      Symbol,    // open | pending | matched | completed | cancelled | disputed
    pub created_at:  u64,
    pub deadline:    u64,
}

#[contracttype] #[derive(Clone)]
pub struct Session {
    pub id:            u64,
    pub learner:       Address,
    pub mentor:        Address,
    pub total_amount:  i128,
    pub milestones:    u32,      // how many sessions planned
    pub paid_count:    u32,      // how many paid so far
    pub amount_each:   i128,
    pub status:        Symbol,   // booked | active | completed | disputed | refunded
    pub created_at:    u64,
    pub deadline:      u64,
}

#[contracttype] #[derive(Clone)]
pub struct Team {
    pub id:             u64,
    pub name:           String,
    pub creator:        Address,
    pub required_stake: i128,
    pub max_members:    u32,
    pub status:         Symbol,  // open | active | closed
    pub created_at:     u64,
    pub deadline:       u64,
}

#[contracttype] #[derive(Clone)]
pub struct Reputation {
    pub score:        i64,   // can go negative
    pub swaps_done:   u32,
    pub sessions_done:u32,
    pub disputes_lost:u32,
}

#[contracttype] #[derive(Clone)]
pub struct Dispute {
    pub id:         u64,
    pub kind:       Symbol,  // swap | session
    pub ref_id:     u64,
    pub raiser:     Address,
    pub respondent: Address,
    pub status:     Symbol,  // open | resolved
    pub created_at: u64,
}

// ─────────────────────────────────────────
// STATUS SYMBOLS
// ─────────────────────────────────────────
fn s_open()      -> Symbol { symbol_short!("open")      }
fn s_pending()   -> Symbol { symbol_short!("pending")   }
fn s_matched()   -> Symbol { symbol_short!("matched")   }
fn s_completed() -> Symbol { symbol_short!("completed") }
fn s_cancelled() -> Symbol { symbol_short!("cancelled") }
fn s_booked()    -> Symbol { symbol_short!("booked")    }
fn s_active()    -> Symbol { symbol_short!("active")    }
fn s_disputed()  -> Symbol { symbol_short!("disputed")  }
fn s_refunded()  -> Symbol { symbol_short!("refunded")  }
fn s_resolved()  -> Symbol { symbol_short!("resolved")  }
fn s_closed()    -> Symbol { symbol_short!("closed")    }

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
fn next_id(env: &Env, key: DataKey) -> u64 {
    let id: u64 = env.storage().instance().get(&key).unwrap_or(0) + 1;
    env.storage().instance().set(&key, &id);
    id
}
fn xlm(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::XlmToken).expect("not init")
}
fn admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).expect("not init")
}
fn transfer(env: &Env, from: &Address, to: &Address, amount: i128) {
    token::Client::new(env, &xlm(env)).transfer(from, to, &amount);
}
fn adjust_rep(env: &Env, user: &Address, delta: i64) {
    let key = DataKey::Reputation(user.clone());
    let mut rep: Reputation = env.storage().persistent().get(&key)
        .unwrap_or(Reputation { score: 0, swaps_done: 0, sessions_done: 0, disputes_lost: 0 });
    rep.score += delta;
    env.storage().persistent().set(&key, &rep);
    env.storage().persistent().extend_ttl(&key, 50_000, 50_000);
}

// ─────────────────────────────────────────
// CONTRACT
// ─────────────────────────────────────────
#[contract]
pub struct SkillSwapV2;

#[contractimpl]
impl SkillSwapV2 {

    // ── INIT ───────────────────────────────
    pub fn initialize(env: Env, admin: Address, xlm_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) { panic!("already init"); }
        env.storage().instance().set(&DataKey::Admin,    &admin);
        env.storage().instance().set(&DataKey::XlmToken, &xlm_token);
        env.storage().instance().extend_ttl(100_000, 100_000);
    }

    // ── SKILL SWAP WITH DUAL ESCROW ─────────────────────────────

    /// Both users stake XLM. If one abandons, their stake is slashed.
    pub fn create_swap(
        env: Env, poster: Address, skill_offer: String, skill_want: String,
        stake_xlm: i128, deadline_seconds: u64,
    ) -> u64 {
        poster.require_auth();
        let stake = stake_xlm * 10_000_000_i128;
        transfer(&env, &poster, &env.current_contract_address(), stake);
        let id = next_id(&env, DataKey::SwapCount);
        let deadline = env.ledger().timestamp() + deadline_seconds;
        env.storage().persistent().set(&DataKey::SwapStake(id, poster.clone()), &stake);
        env.storage().persistent().set(&DataKey::Swap(id), &Swap {
            id, poster: poster.clone(), matcher: poster.clone(),
            has_matcher: false, skill_offer, skill_want,
            stake, status: s_open(), created_at: env.ledger().timestamp(), deadline,
        });
        env.storage().persistent().extend_ttl(&DataKey::Swap(id), 50_000, 50_000);
        id
    }

    /// Matcher joins and deposits their stake.
    pub fn accept_swap(env: Env, matcher: Address, swap_id: u64) {
        matcher.require_auth();
        let mut swap: Swap = env.storage().persistent()
            .get(&DataKey::Swap(swap_id)).expect("not found");
        if swap.status != s_open() { panic!("not open"); }
        if swap.poster == matcher  { panic!("own listing"); }
        transfer(&env, &matcher, &env.current_contract_address(), swap.stake);
        env.storage().persistent().set(&DataKey::SwapStake(swap_id, matcher.clone()), &swap.stake);
        swap.matcher = matcher; swap.has_matcher = true; swap.status = s_matched();
        env.storage().persistent().set(&DataKey::Swap(swap_id), &swap);
    }

    /// Both parties must call complete_swap — on 2nd call, stakes are returned.
    pub fn complete_swap(env: Env, caller: Address, swap_id: u64) {
        caller.require_auth();
        let mut swap: Swap = env.storage().persistent()
            .get(&DataKey::Swap(swap_id)).expect("not found");
        if swap.status != s_matched() { panic!("not matched"); }
        let is_poster  = swap.poster == caller;
        let is_matcher = swap.has_matcher && swap.matcher == caller;
        if !is_poster && !is_matcher { panic!("not a party"); }

        // Return both stakes
        let p_key = DataKey::SwapStake(swap_id, swap.poster.clone());
        let m_key = DataKey::SwapStake(swap_id, swap.matcher.clone());
        let ps: i128 = env.storage().persistent().get(&p_key).unwrap_or(0);
        let ms: i128 = env.storage().persistent().get(&m_key).unwrap_or(0);
        let contract = env.current_contract_address();
        if ps > 0 { transfer(&env, &contract, &swap.poster,  ps); env.storage().persistent().remove(&p_key); }
        if ms > 0 { transfer(&env, &contract, &swap.matcher, ms); env.storage().persistent().remove(&m_key); }

        swap.status = s_completed();
        env.storage().persistent().set(&DataKey::Swap(swap_id), &swap);

        // Reputation rewards
        adjust_rep(&env, &swap.poster,  10);
        adjust_rep(&env, &swap.matcher, 10);
    }

    /// Slash an inactive user after deadline. Their stake goes to the honest party.
    pub fn slash_swap(env: Env, caller: Address, swap_id: u64) {
        caller.require_auth();
        let mut swap: Swap = env.storage().persistent()
            .get(&DataKey::Swap(swap_id)).expect("not found");
        if env.ledger().timestamp() <= swap.deadline { panic!("deadline not passed"); }
        if swap.status != s_matched() { panic!("not matched"); }

        let contract = env.current_contract_address();
        let p_key = DataKey::SwapStake(swap_id, swap.poster.clone());
        let m_key = DataKey::SwapStake(swap_id, swap.matcher.clone());
        let ps: i128 = env.storage().persistent().get(&p_key).unwrap_or(0);
        let ms: i128 = env.storage().persistent().get(&m_key).unwrap_or(0);

        // Determine who called — they get both stakes as reward
        let (honest, cheater) = if swap.poster == caller {
            (swap.poster.clone(), swap.matcher.clone())
        } else if swap.matcher == caller {
            (swap.matcher.clone(), swap.poster.clone())
        } else {
            panic!("not a party");
        };

        let total = ps + ms;
        if total > 0 { transfer(&env, &contract, &honest, total); }
        env.storage().persistent().remove(&p_key);
        env.storage().persistent().remove(&m_key);

        swap.status = s_cancelled();
        env.storage().persistent().set(&DataKey::Swap(swap_id), &swap);
        adjust_rep(&env, &cheater, -25);
    }

    pub fn get_swap(env: Env, swap_id: u64) -> Swap {
        env.storage().persistent().get(&DataKey::Swap(swap_id)).expect("not found")
    }

    // ── MILESTONE SESSION ESCROW ─────────────────────────────────

    /// Learner locks full amount; released milestone by milestone.
    pub fn book_session(
        env: Env, learner: Address, mentor: Address,
        amount_xlm: i128, milestones: u32, deadline_seconds: u64,
    ) -> u64 {
        learner.require_auth();
        if milestones == 0 { panic!("milestones must be > 0"); }
        let total = amount_xlm * 10_000_000_i128;
        let each  = total / milestones as i128;
        transfer(&env, &learner, &env.current_contract_address(), total);
        let id = next_id(&env, DataKey::SessionCount);
        env.storage().persistent().set(&DataKey::Session(id), &Session {
            id, learner, mentor, total_amount: total, milestones,
            paid_count: 0, amount_each: each,
            status: s_booked(),
            created_at: env.ledger().timestamp(),
            deadline: env.ledger().timestamp() + deadline_seconds,
        });
        env.storage().persistent().extend_ttl(&DataKey::Session(id), 50_000, 50_000);
        id
    }

    /// Mentor releases one milestone payment.
    pub fn release_milestone(env: Env, mentor: Address, session_id: u64) {
        mentor.require_auth();
        let mut s: Session = env.storage().persistent()
            .get(&DataKey::Session(session_id)).expect("not found");
        if s.mentor != mentor { panic!("not mentor"); }
        if s.status != s_booked() && s.status != s_active() { panic!("invalid status"); }
        if s.paid_count >= s.milestones { panic!("all paid"); }

        transfer(&env, &env.current_contract_address(), &mentor, s.amount_each);
        s.paid_count += 1;
        s.status = if s.paid_count >= s.milestones { s_completed() } else { s_active() };
        env.storage().persistent().set(&DataKey::Session(session_id), &s);

        if s.status == s_completed() {
            adjust_rep(&env, &mentor,   15);
            adjust_rep(&env, &s.learner, 5);
        }
    }

    /// Refund remaining locked balance to learner (admin or after deadline).
    pub fn refund_remaining(env: Env, caller: Address, session_id: u64) {
        caller.require_auth();
        let mut s: Session = env.storage().persistent()
            .get(&DataKey::Session(session_id)).expect("not found");

        let is_admin    = caller == admin(&env);
        let past_ddline = env.ledger().timestamp() > s.deadline;
        if !is_admin && !past_ddline { panic!("not authorized or deadline not passed"); }
        if s.status == s_refunded() || s.status == s_completed() { panic!("already finalised"); }

        let paid    = s.amount_each * s.paid_count as i128;
        let remaining = s.total_amount - paid;
        if remaining > 0 {
            transfer(&env, &env.current_contract_address(), &s.learner, remaining);
        }
        s.status = s_refunded();
        env.storage().persistent().set(&DataKey::Session(session_id), &s);
        adjust_rep(&env, &s.mentor, -20);
    }

    pub fn get_session(env: Env, session_id: u64) -> Session {
        env.storage().persistent().get(&DataKey::Session(session_id)).expect("not found")
    }

    // ── TEAM WITH COMMITMENT STAKES ───────────────────────────────

    pub fn create_team(
        env: Env, creator: Address, name: String,
        required_stake_xlm: i128, max_members: u32, deadline_seconds: u64,
    ) -> u64 {
        creator.require_auth();
        if required_stake_xlm <= 0 { panic!("stake > 0"); }
        let id = next_id(&env, DataKey::TeamCount);
        env.storage().persistent().set(&DataKey::Team(id), &Team {
            id, name, creator: creator.clone(),
            required_stake: required_stake_xlm * 10_000_000_i128,
            max_members, status: s_open(),
            created_at: env.ledger().timestamp(),
            deadline: env.ledger().timestamp() + deadline_seconds,
        });
        env.storage().persistent().set(&DataKey::TeamMembers(id), &Vec::<Address>::new(&env));
        env.storage().persistent().extend_ttl(&DataKey::Team(id), 50_000, 50_000);
        id
    }

    pub fn join_team(env: Env, member: Address, team_id: u64) {
        member.require_auth();
        let team: Team = env.storage().persistent().get(&DataKey::Team(team_id)).expect("not found");
        if team.status != s_open() { panic!("not open"); }
        let mut members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id)).unwrap_or_else(|| Vec::new(&env));
        if members.len() >= team.max_members { panic!("full"); }
        for m in members.iter() { if m == member { panic!("already joined"); } }
        transfer(&env, &member, &env.current_contract_address(), team.required_stake);
        env.storage().persistent().set(&DataKey::TeamStake(team_id, member.clone()), &team.required_stake);
        env.storage().persistent().set(&DataKey::LastActive(team_id, member.clone()), &env.ledger().timestamp());
        members.push_back(member);
        env.storage().persistent().set(&DataKey::TeamMembers(team_id), &members);
    }

    /// Member checks in to prove activity.
    pub fn mark_active(env: Env, member: Address, team_id: u64) {
        member.require_auth();
        env.storage().persistent()
            .get::<DataKey, i128>(&DataKey::TeamStake(team_id, member.clone()))
            .expect("not a member");
        env.storage().persistent().set(&DataKey::LastActive(team_id, member.clone()), &env.ledger().timestamp());
    }

    /// Slash an inactive member (creator or admin only). Slashed stake goes to team creator.
    pub fn slash_inactive(env: Env, caller: Address, team_id: u64, target: Address, inactivity_window: u64) {
        caller.require_auth();
        let team: Team = env.storage().persistent().get(&DataKey::Team(team_id)).expect("not found");
        if caller != team.creator && caller != admin(&env) { panic!("not authorized"); }

        let last: u64 = env.storage().persistent()
            .get(&DataKey::LastActive(team_id, target.clone())).unwrap_or(0);
        if env.ledger().timestamp() < last + inactivity_window { panic!("still active"); }

        let stake_key = DataKey::TeamStake(team_id, target.clone());
        let stake: i128 = env.storage().persistent().get(&stake_key).unwrap_or(0);
        if stake > 0 {
            transfer(&env, &env.current_contract_address(), &team.creator, stake);
            env.storage().persistent().remove(&stake_key);
        }
        // Remove from members list
        let mut members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id)).unwrap_or_else(|| Vec::new(&env));
        let mut idx_opt: Option<u32> = None;
        for (i, m) in members.iter().enumerate() { if m == target { idx_opt = Some(i as u32); break; } }
        if let Some(idx) = idx_opt { members.remove(idx); }
        env.storage().persistent().set(&DataKey::TeamMembers(team_id), &members);
        adjust_rep(&env, &target, -20);
    }

    /// Creator closes team and refunds all remaining stakes.
    pub fn close_team(env: Env, creator: Address, team_id: u64) {
        creator.require_auth();
        let mut team: Team = env.storage().persistent().get(&DataKey::Team(team_id)).expect("not found");
        if team.creator != creator { panic!("not creator"); }
        if team.status  == s_closed() { panic!("already closed"); }
        let members: Vec<Address> = env.storage().persistent()
            .get(&DataKey::TeamMembers(team_id)).unwrap_or_else(|| Vec::new(&env));
        let contract = env.current_contract_address();
        for m in members.iter() {
            let key = DataKey::TeamStake(team_id, m.clone());
            let stake: i128 = env.storage().persistent().get(&key).unwrap_or(0);
            if stake > 0 {
                transfer(&env, &contract, &m, stake);
                env.storage().persistent().remove(&key);
            }
        }
        team.status = s_closed();
        env.storage().persistent().set(&DataKey::Team(team_id), &team);
    }

    pub fn get_team(env: Env, team_id: u64) -> Team {
        env.storage().persistent().get(&DataKey::Team(team_id)).expect("not found")
    }
    pub fn get_team_members(env: Env, team_id: u64) -> Vec<Address> {
        env.storage().persistent().get(&DataKey::TeamMembers(team_id)).unwrap_or_else(|| Vec::new(&env))
    }

    // ── REPUTATION ENGINE ─────────────────────────────────────────

    pub fn get_reputation(env: Env, user: Address) -> Reputation {
        env.storage().persistent()
            .get(&DataKey::Reputation(user))
            .unwrap_or(Reputation { score: 0, swaps_done: 0, sessions_done: 0, disputes_lost: 0 })
    }

    pub fn rate_user(env: Env, rater: Address, target: Address, score: u32) {
        rater.require_auth();
        if score < 1 || score > 5 { panic!("score 1-5"); }
        if rater == target { panic!("cannot rate self"); }
        adjust_rep(&env, &target, score as i64);
    }

    // ── DISPUTE RESOLUTION ─────────────────────────────────────────

    pub fn raise_dispute(env: Env, raiser: Address, kind: Symbol, ref_id: u64, respondent: Address) -> u64 {
        raiser.require_auth();
        let id = next_id(&env, DataKey::DisputeCount);
        env.storage().persistent().set(&DataKey::Dispute(id), &Dispute {
            id, kind, ref_id, raiser: raiser.clone(), respondent: respondent.clone(),
            status: s_open(), created_at: env.ledger().timestamp(),
        });
        id
    }

    /// Admin resolves dispute. winner_is_raiser=true refunds raiser, else pays respondent.
    pub fn resolve_dispute(env: Env, dispute_id: u64, winner_is_raiser: bool) {
        admin(&env).require_auth();
        let mut d: Dispute = env.storage().persistent()
            .get(&DataKey::Dispute(dispute_id)).expect("not found");
        if d.status != s_open() { panic!("already resolved"); }

        let (winner, loser) = if winner_is_raiser {
            (d.raiser.clone(), d.respondent.clone())
        } else {
            (d.respondent.clone(), d.raiser.clone())
        };

        // Penalise the loser
        adjust_rep(&env, &loser,   -25);
        adjust_rep(&env, &winner,    5);

        d.status = s_resolved();
        env.storage().persistent().set(&DataKey::Dispute(dispute_id), &d);
    }

    pub fn get_dispute(env: Env, dispute_id: u64) -> Dispute {
        env.storage().persistent().get(&DataKey::Dispute(dispute_id)).expect("not found")
    }

    // ── ADMIN ─────────────────────────────────────────────────────
    pub fn transfer_admin(env: Env, current: Address, new_admin: Address) {
        current.require_auth();
        if admin(&env) != current { panic!("not admin"); }
        env.storage().instance().set(&DataKey::Admin, &new_admin);
    }
    pub fn get_admin(env: Env) -> Address { admin(&env) }
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────────
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, Address, String, symbol_short};

    fn setup() -> (Env, SkillSwapV2Client<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let id     = env.register_contract(None, SkillSwapV2);
        let client = SkillSwapV2Client::new(&env, &id);
        let admin  = Address::generate(&env);
        let xlm_id = env.register_stellar_asset_contract_v2(admin.clone());
        let xlm    = xlm_id.address();
        client.initialize(&admin, &xlm);
        (env, client, admin, xlm)
    }

    fn fund(env: &Env, xlm: &Address, to: &Address, amount: i128) {
        soroban_sdk::token::StellarAssetClient::new(env, xlm).mint(to, &(amount * 10_000_000_i128));
    }

    #[test]
    fn test_swap_complete() {
        let (env, c, _, xlm) = setup();
        let alice = Address::generate(&env);
        let bob   = Address::generate(&env);
        fund(&env, &xlm, &alice, 20);
        fund(&env, &xlm, &bob,   20);

        let id = c.create_swap(&alice, &String::from_str(&env,"React"), &String::from_str(&env,"Design"), &5, &86400);
        c.accept_swap(&bob, &id);
        c.complete_swap(&alice, &id);

        let swap = c.get_swap(&id);
        assert_eq!(swap.status, symbol_short!("completed"));
    }

    #[test]
    fn test_milestone_session() {
        let (env, c, _, xlm) = setup();
        let learner = Address::generate(&env);
        let mentor  = Address::generate(&env);
        fund(&env, &xlm, &learner, 30);

        let sid = c.book_session(&learner, &mentor, &30, &3, &86400);
        c.release_milestone(&mentor, &sid);
        c.release_milestone(&mentor, &sid);
        c.release_milestone(&mentor, &sid);

        let s = c.get_session(&sid);
        assert_eq!(s.status, symbol_short!("completed"));
        assert_eq!(s.paid_count, 3);
    }

    #[test]
    fn test_team_slash_inactive() {
        let (env, c, admin, xlm) = setup();
        let creator = Address::generate(&env);
        let bob     = Address::generate(&env);
        fund(&env, &xlm, &bob, 10);

        let tid = c.create_team(&creator, &String::from_str(&env,"Team A"), &5, &3, &86400);
        c.join_team(&bob, &tid);
        assert_eq!(c.get_team_members(&tid).len(), 1);

        // Simulate time passing — slash after 0 window (since no check-in)
        c.slash_inactive(&admin, &tid, &bob, &0);
        assert_eq!(c.get_team_members(&tid).len(), 0);
    }

    #[test]
    fn test_dispute_resolution() {
        let (env, c, _admin, _) = setup();
        let alice = Address::generate(&env);
        let bob   = Address::generate(&env);

        let did = c.raise_dispute(&alice, &symbol_short!("swap"), &1, &bob);
        c.resolve_dispute(&did, &true);

        let d = c.get_dispute(&did);
        assert_eq!(d.status, symbol_short!("resolved"));
    }

    #[test]
    fn test_reputation_engine() {
        let (env, c, _, _) = setup();
        let alice = Address::generate(&env);
        let bob   = Address::generate(&env);

        c.rate_user(&alice, &bob, &5);
        let rep = c.get_reputation(&bob);
        assert!(rep.score > 0);
    }
}
