#[dojo::interface]
trait ISeasonContract {
    fn start_season(ref world: IWorldDispatcher, start_time: u64, duration: u64, entry_amount: u256);
    fn end_season(ref world: IWorldDispatcher, season_id: usize);
    fn donate_season(ref world: IWorldDispatcher, season_id: usize, amount: u256, name: felt252, social: felt252);
}

#[dojo::contract]
mod season_systems {
    use openzeppelin::token::erc20::interface::{
        IERC20Camel, IERC20Dispatcher, IERC20DispatcherTrait, IERC20CamelLibraryDispatcher
    };
    use starknet::{get_caller_address, get_block_info, get_block_timestamp, get_tx_info, get_contract_address};

    use darkshuffle::constants::{PRIZES};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait, Leaderboard, PlayerReward, Donation};
    use darkshuffle::utils::{
        season::season_utils
    };

    #[abi(embed_v0)]
    impl SeasonContractImpl of super::ISeasonContract<ContractState> {
        fn start_season(ref world: IWorldDispatcher, start_time: u64, duration: u64, entry_amount: u256) {
            let season_id = world.uuid();

            set!(world, (
                Season {
                    season_id,
                    start: start_time,
                    end: start_time + duration,
                    entry_amount,
                    reward_pool: 0,
                    finalized: false,
                    contract_address: get_contract_address()
                }
            ));
        }

        fn end_season(ref world: IWorldDispatcher, season_id: usize) {
            let mut season = get!(world, (season_id), Season);
            season.assert_end_season();

            // Distribute prizes
            let chain_id = get_tx_info().unbox().chain_id;
            let payment_dispatcher = IERC20Dispatcher { contract_address: season_utils::get_lords_address(chain_id) };
            payment_dispatcher.approve(season.contract_address, season.reward_pool);

            let mut i = 1;
            while i <= PRIZES {
                let position = get!(world, (season_id, i), Leaderboard);
                if position.score == 0 {
                    break;
                }

                let reward = season.reward_pool / 100 * season_utils::get_prize_percentage(i).into();
                payment_dispatcher.transfer_from(season.contract_address, position.player, reward);
                set!(world, PlayerReward { season_id, player: position.player, reward });
                i += 1;
            };

            // Finalize season
            season.finalized = true;
            set!(world, (season));
        }

        fn donate_season(ref world: IWorldDispatcher, season_id: usize, amount: u256, name: felt252, social: felt252) {
            let mut season = get!(world, (season_id), Season);
            season.assert_donation(amount);

            let chain_id = get_tx_info().unbox().chain_id;
            let address = get_caller_address();

            let payment_dispatcher = IERC20Dispatcher { contract_address: season_utils::get_lords_address(chain_id) };
            payment_dispatcher.transfer_from(address, season.contract_address, amount);
            season.reward_pool += amount;

            let mut donation = get!(world, (season_id, address), Donation);
            donation.name = name;
            donation.social = social;
            donation.amount += amount;

            set!(world, (season, donation));
        }
    }
}