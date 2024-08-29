mod spell_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects};
    use darkshuffle::constants::{CardTags};
    use darkshuffle::utils::{
        battle::battle_utils,
    };

    fn cast_spell(world: IWorldDispatcher, target_id: u16, ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut target: Creature = get!(world, (battle.battle_id, target_id), Creature);
        if target.creature_id > 0 {
            assert(target.health > 0, 'Creature is dead');
        }

        if card.card_tag == CardTags::FATIQUE {
            if battle.round_energy > 0 {
                battle.round_energy -= 1;
            }
        }

        if card.card_id == 10 {
            battle_utils::damage_monster(ref battle, ref battle_effects, card.level, 1);
        }
        
        else if card.card_id == 11 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 3 + 3 * card.level, 1);
        }
        
        else if card.card_id == 12 {
            battle_utils::increase_armor(ref battle, 1 + card.level, ref battle_effects);
        }
        
        else if card.card_id == 30 {
            battle_utils::increase_armor(ref battle, 4, ref battle_effects);
        }

        else if card.card_id == 31 {
            battle_utils::increase_armor(ref battle, 4, ref battle_effects);
        }

        else if card.card_id == 32 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 13, 1);
        }

        else if card.card_id == 33 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 11, 1);
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
            battle.hero_energy += 3;
        }

        else if card.card_id == 38 {
            battle_utils::increase_armor(ref battle, 6, ref battle_effects);
        }

        else if card.card_id == 39 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 15, 1);
        }

        else if card.card_id == 40 {
            battle_utils::piercing_damage_hero(ref battle, 5, ref battle_effects);
            battle_effects.damage_immune = true;
        }

        set!(world, (battle_effects, target));
    }
}