#[starknet::interface]
trait IGameContract<T> {
    fn start_game(ref self: T, season_id: usize, name: felt252);
    fn abandon_game(ref self: T, game_id: usize);
}

#[dojo::contract]
mod game_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use openzeppelin::token::erc20::interface::{
        IERC20Dispatcher, IERC20DispatcherTrait
    };
    use starknet::{get_caller_address, get_tx_info};

    use darkshuffle::constants::{START_HEALTH, MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID, DEFAULT_NS, LAST_NODE_DEPTH};
    use darkshuffle::models::game::{Game};
    use darkshuffle::models::draft::{Draft};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait};
    use darkshuffle::utils::{
        season::SeasonUtilsImpl,
        draft::DraftUtilsImpl,
        random
    };

    #[abi(embed_v0)]
    impl GameContractImpl of super::IGameContract<ContractState> {
        fn start_game(ref self: ContractState, season_id: usize, name: felt252) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let game_id = world.dispatcher.uuid();

            let mut season: Season = world.read_model(season_id);

            let chain_id = get_tx_info().unbox().chain_id;

            if chain_id == MAINNET_CHAIN_ID || chain_id == SEPOLIA_CHAIN_ID {
                season.assert_season();
                
                let payment_dispatcher = IERC20Dispatcher { contract_address: SeasonUtilsImpl::get_lords_address(chain_id) };

                let season_distribution = season.entry_amount;
                payment_dispatcher.transfer_from(get_caller_address(), season.contract_address, season_distribution);

                // let dev_distribution = season.entry_amount / 100 * 20;
                // payment_dispatcher.transfer_from(get_caller_address(), SeasonUtilsImpl::get_developer_address(chain_id), dev_distribution);
                season.reward_pool += season_distribution;
            }

            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);
            let options = DraftUtilsImpl::get_draft_options(seed); 

            world.write_model(@Game {
                game_id,
                season_id,
                player: get_caller_address(),
                player_name: name,
                active: true,
                in_draft: true,
                in_battle: false,
                active_battle_id: 0,

                hero_health: START_HEALTH,
                hero_xp: 1,
                monsters_slain: 0,

                map_level: 0,
                map_depth: LAST_NODE_DEPTH,
                last_node_id: 0,
            });

            world.write_model(@Draft {
                game_id,
                options,
                cards: array![].span()
            });

            world.write_model(@season);
        }

        fn abandon_game(ref self: ContractState, game_id: usize) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            assert(game.player == get_caller_address(), 'Not Owner');
            assert(game.active, 'Game over');

            game.active = false;
            game.hero_health = 0;

            SeasonUtilsImpl::score_game(ref world, game);
            world.write_model(@game);
        }
    }
}