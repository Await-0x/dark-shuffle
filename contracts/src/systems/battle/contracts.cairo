#[dojo::interface]
trait IBattleContract {
    fn summon_creature(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn cast_spell(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn discard(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8);
    fn end_turn(ref world: IWorldDispatcher, battle_id: usize);
}

#[dojo::contract]
mod battle_systems {
    use darkshuffle::constants::{START_ENERGY, CardTags};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, HandCard, Card, Creature, BattleEffects};
    use darkshuffle::utils::{
        summon::summon_utils,
        cards::card_utils,
        board::board_utils,
        spell::spell_utils,
        battle::battle_utils,
        game::game_utils,
        monsters::monster_utils,
        hand::hand_utils,
        draft::draft_utils
    };

    #[abi(embed_v0)]
    impl BattleContractImpl of super::IBattleContract<ContractState> {
        fn summon_creature(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id, hand_card.level);
            
            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);
            
            battle_utils::energy_cost(ref battle, ref battle_effects, card);

            battle.card_index += 1;
            board_utils::add_creature_to_board(battle.card_index, battle_id, world);
            summon_utils::summon_creature(battle.card_index, target_id, world, ref battle, ref battle_effects, card);
            
            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    hand_utils::draw_cards(world, battle_id, battle.game_id, battle.deck);
                }

                set!(world, (battle, battle_effects));
            }
        }

        fn cast_spell(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let card: Card = card_utils::get_card(hand_card.card_id, hand_card.level);
            
            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);
            
            battle_utils::energy_cost(ref battle, ref battle_effects, card);
            spell_utils::cast_spell(world, target_id, ref battle, ref battle_effects, card);
            
            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    hand_utils::draw_cards(world, battle_id, battle.game_id, battle.deck);
                }

                set!(world, (battle, battle_effects));
            }
        }

        fn discard(ref world: IWorldDispatcher, battle_id: usize, hand_card_number: u8) {
            let mut battle: Battle = get!(world, battle_id, Battle); 
            battle.assert_battle(world);

            let hand_card: HandCard = get!(world, (battle_id, hand_card_number), HandCard);
            hand_card.assert_hand_card();

            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);

            battle_utils::discard_cost(ref battle, ref battle_effects);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                delete!(world, (hand_card));

                if hand_utils::count_cards(world, battle_id) == 0 {
                    hand_utils::draw_cards(world, battle_id, battle.game_id, battle.deck);
                }
                
                set!(world, (battle, battle_effects));
            }
        }

        fn end_turn(ref world: IWorldDispatcher, battle_id: usize) {
            let mut battle: Battle = get!(world, battle_id, Battle);
            battle.assert_battle(world);

            let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);

            board_utils::attack_monster(world, ref battle, ref battle_effects);

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
                return;
            }

            monster_utils::monster_ability(world, ref battle, ref battle_effects);

            if battle.hero_burn > 0 {
                battle_utils::damage_hero(ref battle, battle.hero_burn, ref battle_effects);
            }

            if game_utils::is_battle_over(battle) {
                game_utils::end_battle(ref battle, world);
            } else {
                battle.round += 1;
                battle.hero_energy = battle.round_energy;
                battle_effects.damage_immune = false;

                set!(world, (
                    battle, battle_effects
                ));
            }
        }
    }
}