use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Season {
    #[key]
    season_id: usize,
    start: u64,
    end: u64,
    entry_amount: u256,
    reward_pool: u256,
    finalized: bool
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Leaderboard {
    #[key]
    season_id: usize,
    #[key]
    rank: u8,
    player: ContractAddress,
    score: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct PlayerReward {
    #[key]
    season_id: usize,
    #[key]
    player: ContractAddress,
    reward: u256
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
}