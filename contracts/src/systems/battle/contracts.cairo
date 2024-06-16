#[dojo::interface]
trait IBattleContract {
    fn summon_creature(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn cast_spell(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn attack(ref world: IWorldDispatcher, battle_id: usize, creature_id: u16);
    fn discard(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8);
    fn end_turn(ref world: IWorldDispatcher, battle_id: usize);
}

#[dojo::contract]
mod battle_systems {
    use darkshuffle::constants::{START_ENERGY};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, HandCard, Card, Creature};
    use darkshuffle::models::game::{GameEffects};
    use darkshuffle::utils::{
        summon::summon_utils,
        cards::card_utils,
        board::board_utils,
        spell::spell_utils,
        battle::battle_utils,
        game::game_utils,
        monsters::monster_utils,
        hand::hand_utils
    };

    #[abi(embed_v0)]
    impl BattleContractImpl of super::IBattleContract<ContractState> {
        fn summon_creature(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id);
            
            let mut game_effects: GameEffects = get!(world, (battle.game_id), GameEffects);
            battle_utils::energy_cost(ref battle, game_effects, card);

            battle.card_index += 1;
            board_utils::add_creature_to_board(battle.card_index, battle_id, world);
            summon_utils::summon_creature(battle.card_index, target_id, world, ref battle, card);
            
            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    battle.deck_iteration += 1;
                    hand_utils::draw_cards(world, battle_id, battle.game_id);
                }
                
                set!(world, (battle));
            }
        }

        fn cast_spell(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id);
            
            let mut game_effects: GameEffects = get!(world, (battle.game_id), GameEffects);
            
            battle_utils::energy_cost(ref battle, game_effects, card);
            spell_utils::cast_spell(world, target_id, ref battle, card);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    battle.deck_iteration += 1;
                    hand_utils::draw_cards(world, battle_id, battle.game_id);
                }

                set!(world, (battle));
            }

        }

        fn attack(ref world: IWorldDispatcher, battle_id: usize, creature_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let mut creature: Creature = get!(world, (battle_id, creature_id), Creature);
            creature.assert_creature();

            assert(creature.resting_round < battle.round, 'Creature needs rest');
            battle_utils::damage_monster(ref battle, creature.attack);
            battle_utils::damage_creature(ref creature, battle.monster_attack);
            creature.resting_round = battle.round;

            if creature.health == 0 {
                board_utils::remove_creature(ref creature, battle_id, world);
            } else {
                set!(world, (creature));
            }

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                set!(world, (battle));
            }
        }

        fn discard(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            battle.assert_energy(1);
            battle.hero_energy -= 1;

            let mut game_effects: GameEffects = get!(world, (battle.game_id), GameEffects);
            game_effects.cards_discarded += 1;

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    battle.deck_iteration += 1;
                    hand_utils::draw_cards(world, battle_id, battle.game_id);
                }
                
                set!(world, (battle, game_effects));
            }
        }

        fn end_turn(ref world: IWorldDispatcher, battle_id: usize) {
            let mut battle: Battle = get!(world, battle_id, Battle);
            battle.assert_battle(world);

            monster_utils::monster_ability(world, ref battle);
            battle_utils::damage_hero(ref battle, battle.monster_attack);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                battle.round += 1;
                battle.hero_energy = START_ENERGY;

                set!(world, (
                    battle
                ));
            }
        }
    }
}