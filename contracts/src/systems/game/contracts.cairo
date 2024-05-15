#[dojo::interface]
trait IGameContract<TContractState> {
    fn start_game();
    fn start_battle(game_id: usize);
}

#[dojo::contract]
mod game_systems {
    use super::IGameContract;

    use starknet::{get_caller_address, get_block_info};

    use darkshuffle::constants::{DECK_SIZE, START_ENERGY, START_HEALTH};
    use darkshuffle::models::battle::{Battle, Monster};
    use darkshuffle::models::game::{Game};
    use darkshuffle::models::draft::{Draft, DraftEntropy};

    use darkshuffle::utils::{
        draft::draft_utils,
        monsters::monster_utils,
        hand::hand_utils
    };

    #[abi(embed_v0)]
    impl GameContractImpl of IGameContract<ContractState> {
        fn start_game(world: IWorldDispatcher) {
            let game_id = world.uuid();

            set!(world, (
                Game {
                    game_id: game_id,
                    player: get_caller_address(),
                    active: true,
                    in_draft: true,
                    in_battle: false,
                    battles_won: 0,
                },
                Draft {
                    game_id,
                    card_count: 0
                },
                DraftEntropy {
                    game_id,
                    number: 1,
                    block_number: get_block_info().unbox().block_number.into(),
                    block_hash: 0
                }
            ));
        }

        fn start_battle(world: IWorldDispatcher, game_id: usize) {
            let mut game: Game = get!(world, (game_id), Game);

            assert(game.player == get_caller_address(), 'Not Owner');
            assert(game.active, 'Game over');
            assert(!game.in_draft, 'Draft not over');
            assert(!game.in_battle, 'Already in battle');

            let monster: Monster = monster_utils::get_monster(game.battles_won);
            let battle_id = world.uuid();

            hand_utils::draw_cards(world, battle_id);
            set!(world, (
                Battle {
                    battle_id: world.uuid(),
                    game_id: game_id,
                    round: 1,
                    deck_iteration: 1,
                    card_index: 1,
                
                    hero_health: START_HEALTH,
                    hero_energy: START_ENERGY,
                    
                    monster_id: monster.monster_id,
                    monster_attack: monster.attack,
                    monster_health: monster.health
                }
            ));
        }
    }
}