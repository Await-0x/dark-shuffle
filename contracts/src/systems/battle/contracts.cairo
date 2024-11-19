#[starknet::interface]
trait IBattleContract<T> {
    fn battle_actions(ref self: T, battle_id: usize, actions: Span<Span<u8>>);
}

#[dojo::contract]
mod battle_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::constants::{DEFAULT_NS};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, Card, Creature, BattleEffects, Board, BoardStats, CardType};
    use darkshuffle::utils::{
        summon::SummonUtilsImpl,
        cards::CardUtilsImpl,
        board::BoardUtilsImpl,
        battle::BattleUtilsImpl,
        game::GameUtilsImpl,
        monsters::MonsterUtilsImpl,
        random
    };

    #[abi(embed_v0)]
    impl BattleContractImpl of super::IBattleContract<ContractState> {
        fn battle_actions(ref self: ContractState, battle_id: usize, actions: Span<Span<u8>>) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model(battle_id);
            battle.assert_battle(world);

            let mut battle_effects: BattleEffects = world.read_model(battle_id);
            let mut board: Board = world.read_model(battle_id);
            let mut board_stats: BoardStats = BoardUtilsImpl::get_board_stats(board);

            let mut action_index = 0;
            while action_index < actions.len() {
                let action = *actions.at(action_index);

                match *action.at(0) {
                    0 => {
                        assert(battle.card_in_hand(*action.at(1)), 'Card not in hand');
                        let card: Card = CardUtilsImpl::get_card(*action.at(1));
                        BattleUtilsImpl::energy_cost(ref battle, ref battle_effects, card);

                        if card.card_type == CardType::Creature {
                            let creature: Creature = SummonUtilsImpl::summon_creature(card, ref battle, ref battle_effects, ref board, ref board_stats);
                            BoardUtilsImpl::add_creature_to_board(creature, ref board, ref board_stats);
                        }

                        battle.remove_hand_card(*action.at(1));
                    },

                    1 => {
                        assert(action_index == actions.len() - 1, 'Invalid action');
                        BoardUtilsImpl::attack_monster(ref battle, ref battle_effects, ref board, board_stats);
                        BoardUtilsImpl::clean_board(ref battle, ref battle_effects, ref board, board_stats);
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

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
                return;
            };

            MonsterUtilsImpl::monster_ability(ref battle, ref battle_effects);
            BoardUtilsImpl::clean_board(ref battle, ref battle_effects, ref board, board_stats);

            if battle.monster_health > 0 {
                BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, battle.monster_attack);
            }

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
            } else {
                battle.round += 1;
                if battle.round > 10 {  
                    battle.hero_energy = 10;
                } else {
                    battle.hero_energy = battle.round;
                }

                let random_hash = random::get_random_hash();
                let seed: u128 = random::get_entropy(random_hash);
                let shuffled_deck = random::shuffle_deck(seed, battle.deck, battle.deck_index);

                battle.draw_cards(shuffled_deck, 1, battle.deck_index);
                battle.deck = shuffled_deck;

                world.write_model(@battle);
                world.write_model(@battle_effects);
                world.write_model(@board);
            }
        }
    }
}