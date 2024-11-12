use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects};
use darkshuffle::constants::{CardTags};
use darkshuffle::utils::{
    battle::BattleUtilsImpl,
};

#[generate_trait]
impl SpellUtilsImpl of SpellUtilsTrait {
    fn cast_spell(ref world: WorldStorage, target_id: u16, ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut target: Creature = world.read_model((battle.battle_id, target_id));

        if target.creature_id > 0 {
            assert(target.health > 0, 'Creature is dead');
        }

        if card.card_tag == CardTags::FATIQUE {
            if battle.round_energy > 0 {
                battle.round_energy -= 1;
            }
        }

        if card.card_id == 10 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, card.level, 1);
        }
        
        else if card.card_id == 11 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 3 + 3 * card.level, 1);
        }
        
        else if card.card_id == 12 {
            BattleUtilsImpl::increase_armor(ref battle, 1 + card.level, ref battle_effects);
        }
        
        else if card.card_id == 30 {
            BattleUtilsImpl::increase_armor(ref battle, 4, ref battle_effects);
        }

        else if card.card_id == 31 {
            BattleUtilsImpl::increase_armor(ref battle, 4, ref battle_effects);
        }

        else if card.card_id == 32 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 13, 1);
        }

        else if card.card_id == 33 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 11, 1);
        }

        else if card.card_id == 34 {
            target.shield = true;
        }

        else if card.card_id == 35 {
            battle_effects.next_card_reduction = 1;
        }

        else if card.card_id == 36 {
            battle.hero_health += 1;
        }

        else if card.card_id == 37 {
            BattleUtilsImpl::increase_armor(ref battle, 6, ref battle_effects);
        }

        else if card.card_id == 38 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 15, 1);
        }

        else if card.card_id == 39 {
            BattleUtilsImpl::piercing_damage_hero(ref battle, 5, ref battle_effects);
            battle_effects.damage_immune = true;
        }

        world.write_model(@battle_effects);
        world.write_model(@target);
    }
}