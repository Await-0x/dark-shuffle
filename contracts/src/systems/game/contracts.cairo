#[dojo::interface]
trait IGameContract {
    fn start_game(ref world: IWorldDispatcher, name: felt252);
    fn start_battle(ref world: IWorldDispatcher, game_id: usize);
}

#[dojo::contract]
mod game_systems {
    use starknet::{get_caller_address, get_block_info};

    use darkshuffle::constants::{DECK_SIZE, START_ENERGY, START_HEALTH};
    use darkshuffle::models::battle::{Battle, Monster};
    use darkshuffle::models::game::{Game, GameEffects};
    use darkshuffle::models::draft::{Draft, DraftEntropy};

    use darkshuffle::utils::{
        draft::draft_utils,
        monsters::monster_utils,
        hand::hand_utils
    };

    #[abi(embed_v0)]
    impl GameContractImpl of super::IGameContract<ContractState> {
        fn start_game(ref world: IWorldDispatcher, name: felt252) {
            let game_id = world.uuid();

            set!(world, (
                Game {
                    game_id,
                    player: get_caller_address(),
                    player_name: name,
                    active: true,
                    in_draft: true,
                    in_battle: false,
                    battles_won: 0,
                    active_battle_id: 0,
                    hero_health: START_HEALTH,
                    hero_energy: START_ENERGY,
                    deck_iteration: 0
                },
                GameEffects {
                    game_id,
                    cards_discarded: 0,
                    creatures_played: 0,
                    spells_played: 0,
                    demons_played: 0,
                    next_spell_reduction: 0,
                    dead_creatures: 0
                },
                Draft {
                    game_id,
                    card_count: 0,
                    entropy_count: 1
                },
                DraftEntropy {
                    game_id,
                    number: 1,
                    block_number: get_block_info().unbox().block_number.into() + 1,
                    block_hash: 0
                }
            ));
        }

        fn start_battle(ref world: IWorldDispatcher, game_id: usize) {
            let mut game: Game = get!(world, (game_id), Game);

            assert(game.player == get_caller_address(), 'Not Owner');
            assert(game.active, 'Game over');
            assert(!game.in_draft, 'Draft not over');
            assert(!game.in_battle, 'Already in battle');

            let monster: Monster = monster_utils::get_monster(game.battles_won);
            let battle_id = world.uuid();

            game.in_battle = true;
            game.active_battle_id = battle_id;
            
            hand_utils::draw_cards(world, battle_id, game.game_id);

            set!(world, (
                Battle {
                    battle_id: battle_id,
                    game_id: game.game_id,
                    round: 1,
                    card_index: 1,
                
                    hero_health: game.hero_health,
                    hero_energy: game.hero_energy,
                    deck_iteration: game.deck_iteration,
                    hero_armor: 0,
                    
                    monster_id: monster.monster_id,
                    monster_attack: monster.attack,
                    monster_health: monster.health
                },
                game
            ));
        }
    }
}