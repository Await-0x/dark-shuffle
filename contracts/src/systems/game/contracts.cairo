#[dojo::interface]
trait IGameContract {
    fn start_game(ref world: IWorldDispatcher, season_id: usize, name: felt252);
    fn verify_game(ref world: IWorldDispatcher, game_id: usize);
    fn abandon_game(ref world: IWorldDispatcher, game_id: usize);
}

#[dojo::contract]
mod game_systems {
    use openzeppelin::token::erc20::interface::{
        IERC20Camel, IERC20Dispatcher, IERC20DispatcherTrait, IERC20CamelLibraryDispatcher
    };
    use starknet::{get_caller_address, get_block_info, get_tx_info, get_contract_address};

    use darkshuffle::constants::{DECK_SIZE, START_ENERGY, START_HEALTH, LAST_NODE_LEVEL, MAINNET_CHAIN_ID};
    use darkshuffle::models::game::{Game};
    use darkshuffle::models::draft::{Draft};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait};
    use darkshuffle::utils::{
        game::game_utils,
        season::season_utils
    };

    #[abi(embed_v0)]
    impl GameContractImpl of super::IGameContract<ContractState> {
        fn start_game(ref world: IWorldDispatcher, season_id: usize, name: felt252) {
            let game_id = world.uuid();

            let mut season = get!(world, (season_id), Season);

            let chain_id = get_tx_info().unbox().chain_id;

            if chain_id == MAINNET_CHAIN_ID {
                season.assert_season();
                
                let payment_dispatcher = IERC20Dispatcher { contract_address: season_utils::get_lords_address(chain_id) };

                let season_distribution = season.entry_amount / 100 * 80;
                let dev_distribution = season.entry_amount / 100 * 20;

                payment_dispatcher.transfer_from(get_caller_address(), get_contract_address(), season_distribution);
                payment_dispatcher.transfer_from(get_caller_address(), season_utils::get_developer_address(chain_id), dev_distribution);
                season.reward_pool += season_distribution;
            }

            set!(world, (
                Game {
                    game_id,
                    season_id,
                    player: get_caller_address(),
                    player_name: name,
                    active: true,
                    in_draft: true,
                    in_battle: false,
                    active_battle_id: 0,

                    hero_health: START_HEALTH,
                    hero_energy: START_ENERGY,
                    hero_xp: 1,

                    branch: 0,
                    node_level: LAST_NODE_LEVEL,
                    monsters_slain: 0,
                    entropy_count: 1,
                    entropy_verified: false
                },
                Draft {
                    game_id,
                    card_count: 0
                },
                Entropy {
                    game_id,
                    number: 1,
                    block_number: get_block_info().unbox().block_number.into() + 1,
                    block_hash: 0
                },
                season
            ));
        }

        fn verify_game(ref world: IWorldDispatcher, game_id: usize) {
            let mut game = get!(world, (game_id), Game);
            assert(!game.active, 'Game Active');

            game_utils::verify_game(ref game, world);
            set!(world, (game));
        }

        fn abandon_game(ref world: IWorldDispatcher, game_id: usize) {
            let mut game = get!(world, (game_id), Game);
            assert(game.player == get_caller_address(), 'Not Owner');
            assert(game.active, 'Game over');

            game.active = false;
            game.hero_health = 0;
            
            game_utils::verify_game(ref game, world);
            set!(world, (game));
        }
    }
}