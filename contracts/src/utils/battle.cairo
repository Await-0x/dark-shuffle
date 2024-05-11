mod battle_utils {
    use darkshuffle::constants::{CardTypes};
    use darkshuffle::models::battle::{Battle, BattleEffects, Creature, Card};

    fn energy_cost(ref battle: Battle, battle_effects: BattleEffects, card: Card) {
        let mut cost = card.cost;
        
        if card.card_type == CardTypes::SPELL {
            if battle_effects.next_spell_reduction >= cost {
                return;
            }
            
            cost -= battle_effects.next_spell_reduction;
        }
        
        let id = card.card_id;
        if id == 5 || id == 8 || id == 11 || id == 12 || id == 20 || id == 21 || id == 22 || id == 24 {
            let reduction = battle.deck_iteration - 1;

            if reduction >= cost {
                return;
            }

            cost -= reduction;
        }
        
        assert(battle.hero_energy >= cost, 'Not enough energy');

        battle.hero_energy -= cost;
    }

    fn damage_hero(ref battle: Battle, amount: u16) {
        if battle.hero_health < amount {
            battle.hero_health = 0;
        } else {
            battle.hero_health -= amount;
        }
    }

    fn damage_monster(ref battle: Battle, amount: u16) {
        if battle.monster_health < amount {
            battle.monster_health = 0;
        } else {
            battle.monster_health -= amount;
        }
    }

    fn damage_creature(ref creature: Creature, amount: u16) {
        if amount > 0 && creature.shield {
            creature.shield = false;
            return;
        }

        if creature.health < amount {
            creature.health = 0;
        } else {
            creature.health -= amount;
        }
    }
}