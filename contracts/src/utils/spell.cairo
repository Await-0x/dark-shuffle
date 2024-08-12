mod spell_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects};
    use darkshuffle::constants::{CardTags};
    use darkshuffle::utils::{
        battle::battle_utils,
    };

    fn cast_spell(world: IWorldDispatcher, target_id: u16, ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut target: Creature = get!(world, (battle.battle_id, target_id), Creature);

        if card.card_id == 10 {
            battle_utils::damage_monster(ref battle, card.level + 6);
        }
        
        else if card.card_id == 11 {
            battle_utils::damage_monster(ref battle, card.level + 12);
        }
        
        else if card.card_id == 12 {
            battle.hero_armor += card.level;
        }
        
        else if card.card_id == 30 {
            battle.hero_armor += 5;
        }

        else if card.card_id == 31 {
            battle.hero_armor += 4;
        }

        else if card.card_id == 32 {
            battle_utils::damage_monster(ref battle, 21);
        }

        else if card.card_id == 33 {
            battle_utils::damage_monster(ref battle, 12);
        }

        else if card.card_id == 34 {
            target.shield = true;
        }

        else if card.card_id == 35 {
            battle_effects.next_card_reduction = 1;
        }

        else if card.card_id == 36 {
            battle.hero_health += 3;
        }

        else if card.card_id == 37 {
            battle.hero_energy += 5;
        }

        else if card.card_id == 38 {
            battle.hero_armor += 5;
        }

        else if card.card_id == 39 {
            battle_utils::damage_monster(ref battle, 15);
        }

        else if card.card_id == 40 {
            battle_effects.damage_immune = true;
        }

        set!(world, (battle_effects, target));
    }
}