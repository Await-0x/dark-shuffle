mod battle_utils {
    use darkshuffle::constants::{CardTypes, CardTags};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects, BattleOwnerTrait};

    fn discard_cost(ref battle: Battle, ref battle_effects: BattleEffects) {
        let mut cost = 1;

        if battle.monster_id == 11 {
            cost += 1;
        }

        if battle_effects.free_discard {
            battle_effects.free_discard = false;
            return;
        }

        battle.assert_energy(cost);
        battle.hero_energy -= cost;
    }

    fn energy_cost(ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut cost = card.cost;

        if battle.monster_id == 5 && card.card_type == CardTypes::CREATURE {
            cost += 1;
        }

        if battle.monster_id == 10 && card.card_type == CardTypes::SPELL {
            cost += 1;
        }

        if card.card_tag == CardTags::RENEWABLE {
            if (card.level - 1) >= cost {
                cost = 1;
            } else {
                cost -= (card.level - 1);
            }
        }

        if card.card_type == CardTypes::SPELL {
            if battle_effects.next_spell_reduction >= cost {
                cost = 0;
            } else {
                cost -= battle_effects.next_spell_reduction;
            }

            battle_effects.next_spell_reduction = 0;
        }

        if battle_effects.next_card_reduction >= cost {
            cost = 0;
        } else {
            cost -= battle_effects.next_card_reduction;
        }
        
        battle_effects.next_card_reduction = 0;

        assert(battle.hero_energy >= cost, 'Not enough energy');
        battle.hero_energy -= cost;
    }

    fn damage_hero(ref battle: Battle, amount: u16, ref battle_effects: BattleEffects) {
        let mut damage = amount;

        if battle_effects.damage_immune {
            return;
        }

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

    fn piercing_damage_hero(ref battle: Battle, amount: u16, ref battle_effects: BattleEffects) {
        let mut damage = amount;

        if battle_effects.damage_immune {
            return;
        }

        if battle.hero_health < damage {
            battle.hero_health = 0;
        } else {
            battle.hero_health -= damage;
        }
    }

    fn increase_armor(ref battle: Battle, amount: u16, ref battle_effects: BattleEffects) {
        battle.hero_armor += amount;

        if battle.monster_id == 20 && battle.hero_armor > 10 {
            battle.hero_armor = 10;
        }
    }

    fn damage_monster(ref battle: Battle, ref battle_effects: BattleEffects, amount: u16, damage_type: u8) {
        let mut damage = amount;

        // Spell damage
        if damage_type == 1 {
            if battle.monster_id == 8 {
                return;
            }

            if battle.monster_id == 15 {
                damage_hero(ref battle, battle.branch, ref battle_effects);
            }
        }

        // Creature damage
        if damage_type == 2 {
            if battle.monster_id == 9 {
                return;
            }

            if battle.monster_id == 16 {
                damage_hero(ref battle, battle.branch, ref battle_effects);
            }
        }

        if battle.monster_id == 3 {
            if battle.branch >= damage {
                damage = 0;
            } else {
                damage -= battle.branch;
            }
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