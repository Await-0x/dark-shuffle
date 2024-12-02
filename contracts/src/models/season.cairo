use starknet::{ContractAddress, get_block_timestamp};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Season {
    #[key]
    season_id: usize,
    start: u64,
    end: u64,
    card_ids: Span<u64>,
    entry_amount: u256,
    reward_pool: u256,
    finalized: bool,
    contract_address: ContractAddress
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Leaderboard {
    #[key]
    season_id: usize,
    #[key]
    rank: u8,
    player: ContractAddress,
    score: u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct PlayerReward {
    #[key]
    season_id: usize,
    #[key]
    player: ContractAddress,
    reward: u256
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Donation {
    #[key]
    season_id: usize,
    #[key]
    address: ContractAddress,
    name: felt252,
    social: felt252,
    amount: u256
}

#[generate_trait]
impl SeasonOwnerImpl of SeasonOwnerTrait {
    fn assert_season(self: Season) {
        let current_time = get_block_timestamp();
        assert(current_time >= self.start, 'Season not started');
        assert(current_time < self.end, 'Season ended');
    }

    fn assert_end_season(self: Season) {
        let current_time = get_block_timestamp();
        assert(current_time > self.end, 'Season not over');
        assert(!self.finalized, 'Season has been finalized');
    }

    fn assert_donation(self: Season, amount: u256) {
        assert(!self.finalized, 'Season has been finalized');
        assert(amount >= 10000000000000000000, 'Minimum donation is 10 $LORDS');
    }
}