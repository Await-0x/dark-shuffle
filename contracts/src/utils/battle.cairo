mod battle_utils {
    use darkshuffle::constants::{CardTypes, CardTags};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects, HandCard};

    fn energy_cost(ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut cost = card.cost;

        if battle.monster_id == 5 && card.card_type == CardTypes::CREATURE {
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

    fn damage_monster(ref battle: Battle, amount: u16) {
        let mut damage = amount;

        if battle.monster_id == 3 {
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

    fn play_unstable_card(hand_card: HandCard, ref battle_effects: BattleEffects) {
        let mut unstables_played: Array<u8> = battle_effects.unstables_played.into();
        unstables_played.append(hand_card.hand_card_number);
        battle_effects.unstables_played = unstables_played.span();
    }
}