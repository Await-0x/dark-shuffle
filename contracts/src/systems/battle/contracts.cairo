#[starknet::interface]
trait IBattleContract<T> {
    fn battle_actions(ref self: T, game_id: u128, battle_id: u16, actions: Span<Span<u8>>);
}

#[dojo::contract]
mod battle_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::constants::{DEFAULT_NS};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, Card, Creature, Board, BoardStats, CardType, RoundStats};
    use darkshuffle::models::game::{Game, GameEffects};
    use darkshuffle::models::config::GameSettings;
    use darkshuffle::utils::{
        achievements::AchievementsUtilsImpl,
        summon::SummonUtilsImpl,
        spell::SpellUtilsImpl,
        cards::CardUtilsImpl,
        board::BoardUtilsImpl,
        battle::BattleUtilsImpl,
        game::GameUtilsImpl,
        monsters::MonsterUtilsImpl,
        hand::HandUtilsImpl,
        config::ConfigUtilsImpl,
        random
    };

    use achievement::store::{Store, StoreTrait};
    use darkshuffle::utils::tasks::index::{Task, TaskTrait};

    #[abi(embed_v0)]
    impl BattleContractImpl of super::IBattleContract<ContractState> {
        fn battle_actions(ref self: ContractState, game_id: u128, battle_id: u16, actions: Span<Span<u8>>) {
            assert(*(*actions.at(actions.len() - 1)).at(0) == 1, 'Must end turn');

            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model((battle_id, game_id));
            battle.assert_battle(world);

            let mut game: Game = world.read_model(game_id);
            let game_settings: GameSettings = ConfigUtilsImpl::get_game_settings(world, battle.game_id);
            let mut game_effects: GameEffects = world.read_model(battle.game_id);
            let mut board: Board = world.read_model((battle_id, game_id));
            let mut board_stats: BoardStats = BoardUtilsImpl::get_board_stats(board, battle.monster.monster_id);

            let mut round_stats: RoundStats = RoundStats {
                monster_start_health: battle.monster.health,
                creatures_played: 0,
                creature_attack_count: 0
            };

            let mut action_index = 0;
            while action_index < actions.len() {
                let action = *actions.at(action_index);

                match *action.at(0) {
                    0 => {
                        assert(battle.card_in_hand(*action.at(1)), 'Card not in hand');
                        let card: Card = CardUtilsImpl::get_card(*action.at(1));
                        BattleUtilsImpl::energy_cost(ref battle, round_stats, game_effects, card);

                        match card.card_type {
                            CardType::Creature => {
                                let creature: Creature = SummonUtilsImpl::summon_creature(
                                    card,
                                    ref battle,
                                    ref board,
                                    ref board_stats,
                                    ref round_stats,
                                    game_effects
                                );
                                BoardUtilsImpl::add_creature_to_board(creature, ref board, ref board_stats);
                                if game.season_id != 0 {
                                    AchievementsUtilsImpl::play_creature(ref world, card);
                                }
                            },
                            
                            CardType::Spell => {
                                SpellUtilsImpl::cast_spell(
                                    card,
                                    ref battle,
                                    ref board,
                                    ref board_stats,
                                );
                            }
                        }

                        HandUtilsImpl::remove_hand_card(ref battle, *action.at(1));
                    },

                    1 => {
                        assert(action_index == actions.len() - 1, 'Invalid action');
                        BoardUtilsImpl::attack_monster(ref battle, ref board, board_stats, ref round_stats);
                        BoardUtilsImpl::clean_board(ref battle, ref board, board_stats);
                        board_stats = BoardUtilsImpl::get_board_stats(board, battle.monster.monster_id);

                        if game.season_id != 0 && battle.monster.health + 25 <= round_stats.monster_start_health {
                            AchievementsUtilsImpl::big_hit(ref world);
                        }
                    },

                    _ => {
                        assert(false, 'Invalid action');
                    }
                }

                if GameUtilsImpl::is_battle_over(battle) {
                    break;
                }

                action_index += 1;
            };

            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle, ref game_effects);
                return;
            };

            if game_effects.hero_card_heal {
                BattleUtilsImpl::heal_hero(ref battle, battle.hand.len().try_into().unwrap());
            }

            MonsterUtilsImpl::monster_ability(ref battle, game_effects, board, board_stats, round_stats, seed);
            BoardUtilsImpl::clean_board(ref battle, ref board, board_stats);

            if battle.monster.health > 0 {
                BattleUtilsImpl::damage_hero(ref battle, game_effects, battle.monster.attack);
            }

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle, ref game_effects);
            } else {
                battle.round += 1;
                if battle.round > game_settings.max_energy {
                    battle.hero.energy = game_settings.max_energy;
                } else {
                    battle.hero.energy = battle.round;
                }

                let shuffled_deck = random::shuffle_deck(seed, battle.deck, battle.deck_index);

                HandUtilsImpl::draw_cards(ref battle, shuffled_deck, 1 + game_effects.card_draw, battle.deck_index, game_settings.max_hand_size);
                battle.deck = shuffled_deck;

                world.write_model(@battle);
                world.write_model(@board);
            }
        }
    }
}