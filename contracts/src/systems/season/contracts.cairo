#[dojo::interface]
trait ISeasonContract {
    fn start_season(ref world: IWorldDispatcher, duration: u64, entry_amount: u256);
    fn end_season(ref world: IWorldDispatcher, season_id: usize);
}

#[dojo::contract]
mod season_systems {
    use openzeppelin::token::erc20::interface::{
        IERC20Camel, IERC20Dispatcher, IERC20DispatcherTrait, IERC20CamelLibraryDispatcher
    };
    use starknet::{get_caller_address, get_block_info, get_block_timestamp, get_tx_info, get_contract_address};

    use darkshuffle::constants::{PRIZES};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait, Leaderboard, PlayerReward};
    use darkshuffle::utils::{
        season::season_utils
    };

    #[abi(embed_v0)]
    impl SeasonContractImpl of super::ISeasonContract<ContractState> {
        fn start_season(ref world: IWorldDispatcher, duration: u64, entry_amount: u256) {
            let season_id = world.uuid();
            let current_time = get_block_timestamp();

            set!(world, (
                Season {
                    season_id,
                    start: current_time,
                    end: current_time + duration,
                    entry_amount,
                    reward_pool: 0,
                    finalized: false
                }
            ));
        }

        fn end_season(ref world: IWorldDispatcher, season_id: usize) {
            let mut season = get!(world, (season_id), Season);
            season.assert_end_season();

            // Distribute prizes
            let chain_id = get_tx_info().unbox().chain_id;
            let payment_dispatcher = IERC20Dispatcher { contract_address: season_utils::get_lords_address(chain_id) };

            let mut i = PRIZES;
            while i > 0 {
                let position = get!(world, (season_id, i), Leaderboard);
                let reward = season.reward_pool / 100 * season_utils::get_prize_percentage(i).into();

                payment_dispatcher.transfer_from(get_contract_address(), position.player, reward);
                set!(world, PlayerReward { season_id, player: position.player, reward });
                i -= 1;
            };

            // Finalize season
            season.finalized = true;
            set!(world, (season));
        }
    }
}