#[starknet::interface]
trait ISeasonContract<T> {
    fn start_season(ref self: T, start_time: u64, duration: u64, entry_amount: u256);
    fn end_season(ref self: T, season_id: usize);
    fn donate_season(ref self: T, season_id: usize, amount: u256, name: felt252, social: felt252);
}

#[dojo::contract]
mod season_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use openzeppelin::token::erc20::interface::{
        IERC20Camel, IERC20Dispatcher, IERC20DispatcherTrait, IERC20CamelLibraryDispatcher
    };
    use starknet::{get_caller_address, get_block_info, get_block_timestamp, get_tx_info, get_contract_address};

    use darkshuffle::constants::{PRIZES, DEFAULT_NS};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait, Leaderboard, PlayerReward, Donation};
    use darkshuffle::utils::{
        season::SeasonUtilsImpl
    };

    #[abi(embed_v0)]
    impl SeasonContractImpl of super::ISeasonContract<ContractState> {
        fn start_season(ref self: ContractState, start_time: u64, duration: u64, entry_amount: u256) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let season_id = world.dispatcher.uuid();

            world.write_model(@Season {
                season_id,
                start: start_time,
                end: start_time + duration,
                entry_amount,
                reward_pool: 0,
                finalized: false,
                contract_address: get_contract_address()
            });
        }

        fn end_season(ref self: ContractState, season_id: usize) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut season: Season = world.read_model(season_id);
            season.assert_end_season();

            // Distribute prizes
            let chain_id = get_tx_info().unbox().chain_id;
            let payment_dispatcher = IERC20Dispatcher { contract_address: SeasonUtilsImpl::get_lords_address(chain_id) };
            payment_dispatcher.approve(season.contract_address, season.reward_pool);
            
            let mut i = 1;
            while i <= PRIZES {
                let position: Leaderboard = world.read_model((season_id, i));
                if position.score == 0 {
                    break;
                }

                let reward = season.reward_pool / 100 * SeasonUtilsImpl::get_prize_percentage(i).into();
                payment_dispatcher.transfer_from(season.contract_address, position.player, reward);
                world.write_model(@PlayerReward { season_id, player: position.player, reward });
                i += 1;
            };

            // Finalize season
            season.finalized = true;
            world.write_model(@season);
        }

        fn donate_season(ref self: ContractState, season_id: usize, amount: u256, name: felt252, social: felt252) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut season: Season = world.read_model(season_id);
            season.assert_donation(amount);

            let chain_id = get_tx_info().unbox().chain_id;
            let address = get_caller_address();

            let payment_dispatcher = IERC20Dispatcher { contract_address: SeasonUtilsImpl::get_lords_address(chain_id) };
            payment_dispatcher.transfer_from(address, season.contract_address, amount);
            season.reward_pool += amount;

            let mut donation: Donation = world.read_model((season_id, address));
            donation.name = name;
            donation.social = social;
            donation.amount += amount;

            world.write_model(@season);
            world.write_model(@donation);
        }
    }
}