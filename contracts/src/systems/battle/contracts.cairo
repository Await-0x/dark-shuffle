#[dojo::interface]
trait IBattleContract<TContractState> {
    fn summon_creature(battle_id: usize, hand_card_number: u8, target_id: u16);
    fn cast_spell(battle_id: usize, hand_card_number: u8, target_id: u16);
    fn attack(battle_id: usize, creature_id: u16);
    fn discard(battle_id: usize, hand_card_number: u8);
    fn end_turn(battle_id: usize);
}

#[dojo::contract]
mod battle_systems {
    use super::IBattleContract;

    use darkshuffle::constants::{START_ENERGY};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, HandCard, Card, BattleEffects, RoundEffects, Creature};
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
    impl BattleContractImpl of IBattleContract<ContractState> {
        fn summon_creature(world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id);
            
            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);
            battle_utils::energy_cost(ref battle, battle_effects, card);

            battle.card_index += 1;
            board_utils::add_creature_to_board(battle.card_index, battle_id, world);
            summon_utils::summon_creature(battle.card_index, target_id, world, ref battle, card);
            
            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                set!(world, (battle));
                delete!(world, (hand_card));
            }
        }

        fn cast_spell(world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id);
            
            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);
            
            battle_utils::energy_cost(ref battle, battle_effects, card);
            spell_utils::cast_spell(world, target_id, ref battle, card);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                set!(world, (battle));
                delete!(world, (hand_card));
            }

        }

        fn attack(world: IWorldDispatcher, battle_id: usize, creature_id: u16) {
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

        fn discard(world: IWorldDispatcher, battle_id: usize, hand_card_number: u8) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            battle.assert_energy(1);
            battle.hero_energy -= 1;

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                set!(world, (battle));
                delete!(world, (hand_card));
            }
        }

        fn end_turn(world: IWorldDispatcher, battle_id: usize) {
            let mut battle: Battle = get!(world, battle_id, Battle);
            battle.assert_battle(world);

            monster_utils::monster_ability(world, ref battle);
            battle_utils::damage_hero(ref battle, battle.monster_attack);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                battle.round += 1;
                battle.hero_energy = START_ENERGY;

                if hand_utils::count_cards(world, battle_id) == 0 {
                    battle.deck_iteration += 1;
                    hand_utils::draw_cards(world, battle_id);
                }

                set!(world, (
                    battle,
                    RoundEffects { battle_id, creatures_played: 0 }
                ));
            }
        }
    }
}