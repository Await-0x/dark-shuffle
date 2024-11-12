#[starknet::interface]
trait IBattleContract<T> {
    fn summon_creature(ref self: T, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn cast_spell(ref self: T, battle_id: usize, hand_card_number: u8, target_id: u16);
    fn discard(ref self: T, battle_id: usize, hand_card_number: u8);
    fn end_turn(ref self: T, battle_id: usize);
}

#[dojo::contract]
mod battle_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::constants::{START_ENERGY, CardTags, DEFAULT_NS};
    use darkshuffle::models::battle::{Battle, BattleOwnerTrait, HandCard, Card, Creature, BattleEffects};
    use darkshuffle::utils::{
        summon::SummonUtilsImpl,
        cards::CardUtilsImpl,
        board::BoardUtilsImpl,
        spell::SpellUtilsImpl,
        battle::BattleUtilsImpl,
        game::GameUtilsImpl,
        monsters::MonsterUtilsImpl,
        hand::HandUtilsImpl,
        draft::DraftUtilsImpl
    };

    #[abi(embed_v0)]
    impl BattleContractImpl of super::IBattleContract<ContractState> {
        fn summon_creature(ref self: ContractState, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model(battle_id);
            battle.assert_battle(world);

            let hand_card: HandCard = world.read_model((battle_id, hand_card_number));
            hand_card.assert_hand_card();

            let card: Card = CardUtilsImpl::get_card(hand_card.card_id, hand_card.level);
            
            let mut battle_effects: BattleEffects = world.read_model(battle.battle_id);
            
            BattleUtilsImpl::energy_cost(ref battle, ref battle_effects, card);

            battle.card_index += 1;
            BoardUtilsImpl::add_creature_to_board(ref world, battle.card_index, battle_id);
            SummonUtilsImpl::summon_creature(ref world, battle.card_index, target_id, ref battle, ref battle_effects, card);
            
            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
            } else {
                world.erase_model(@hand_card);

                if HandUtilsImpl::count_cards(world, battle_id) == 0 {
                    HandUtilsImpl::draw_cards(ref world, battle_id, battle.game_id, battle.deck);
                }

                world.write_model(@battle);
                world.write_model(@battle_effects);
            }
        }

        fn cast_spell(ref self: ContractState, battle_id: usize, hand_card_number: u8, target_id: u16) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model(battle_id);
            battle.assert_battle(world);

            let hand_card: HandCard = world.read_model((battle_id, hand_card_number));
            hand_card.assert_hand_card();

            let card: Card = CardUtilsImpl::get_card(hand_card.card_id, hand_card.level);
            
            let mut battle_effects: BattleEffects = world.read_model(battle.battle_id);
            
            BattleUtilsImpl::energy_cost(ref battle, ref battle_effects, card);
            SpellUtilsImpl::cast_spell(ref world, target_id, ref battle, ref battle_effects, card);
            
            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world,ref battle);
            } else {
                world.erase_model(@hand_card);

                if HandUtilsImpl::count_cards(world, battle_id) == 0 {
                    HandUtilsImpl::draw_cards(ref world, battle_id, battle.game_id, battle.deck);
                }
    
                world.write_model(@battle);
                world.write_model(@battle_effects);
            }
        }

        fn discard(ref self: ContractState, battle_id: usize, hand_card_number: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model(battle_id);
            battle.assert_battle(world);

            let hand_card: HandCard = world.read_model((battle_id, hand_card_number));
            hand_card.assert_hand_card();

            let mut battle_effects: BattleEffects = world.read_model(battle.battle_id);

            BattleUtilsImpl::discard_cost(ref battle, ref battle_effects);

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
            } else {
                world.erase_model(@hand_card);

                if HandUtilsImpl::count_cards(world, battle_id) == 0 {
                    HandUtilsImpl::draw_cards(ref world, battle_id, battle.game_id, battle.deck);
                }
                
                world.write_model(@battle);
                world.write_model(@battle_effects);
            }
        }

        fn end_turn(ref self: ContractState, battle_id: usize) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut battle: Battle = world.read_model(battle_id);
            battle.assert_battle(world);

            let mut battle_effects: BattleEffects = world.read_model(battle.battle_id);

            BoardUtilsImpl::attack_monster(ref world, ref battle, ref battle_effects);

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
                return;
            }

            MonsterUtilsImpl::monster_ability(ref world, ref battle, ref battle_effects);

            if battle.hero_burn > 0 {
                BattleUtilsImpl::damage_hero(ref battle, battle.hero_burn, ref battle_effects);
            }

            if GameUtilsImpl::is_battle_over(battle) {
                GameUtilsImpl::end_battle(ref world, ref battle);
            } else {
                battle.round += 1;
                battle.hero_energy = battle.round_energy;
                battle_effects.damage_immune = false;

                world.write_model(@battle);
                world.write_model(@battle_effects);
            }
        }
    }
}