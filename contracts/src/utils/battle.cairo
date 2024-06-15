mod battle_utils {
    use darkshuffle::constants::{CardTypes};
    use darkshuffle::models::battle::{Battle, Creature, Card};
    use darkshuffle::models::game::{GameEffects};

    fn energy_cost(ref battle: Battle, game_effects: GameEffects, card: Card) {
        let mut cost = card.cost;
        
        if battle.monster_id == 405 && card.card_type == CardTypes::CREATURE {
            cost += 1;
        }

        if card.card_type == CardTypes::SPELL {
            if game_effects.next_spell_reduction >= cost {
                return;
            }
            
            cost -= game_effects.next_spell_reduction;
        }
        
        let id = card.card_id;
        if id == 5 || id == 11 || id == 12 || id == 20 || id == 21 || id == 22 || id == 24 {
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
        let mut damage = amount;

        if battle.hero_armor <= damage {
            damage -= battle.hero_armor;
            battle.hero_armor = 0;
        } else {
            battle.hero_armor -= damage;
            damage = 0;
        }

        if battle.hero_health < damage {
            battle.hero_health = 0;
        } else {
            battle.hero_health -= damage;
        }
    }

    fn damage_monster(ref battle: Battle, amount: u16) {
        let mut damage = amount;

        if battle.monster_id == 403 {
            damage -= 1;
        }

        if battle.monster_health < damage {
            battle.monster_health = 0;
        } else {
            battle.monster_health -= damage;
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