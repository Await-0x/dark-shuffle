use darkshuffle::models::battle::{Battle, BoardStats, Creature, Card, BattleEffects, BattleOwnerTrait, CardType, CreatureType};

#[generate_trait]
impl BattleUtilsImpl of BattleUtilsTrait {
    fn reduce_monster_attack(ref battle: Battle, amount: u8) {
        if battle.monster_attack < amount {
            battle.monster_attack = 1;
        } else {
            battle.monster_attack -= amount;
        }

        if battle.monster_attack == 0 {
            battle.monster_attack = 1;
        }
    }

    fn energy_cost(ref battle: Battle, ref battle_effects: BattleEffects, card: Card) {
        let mut cost = card.cost;
        assert(battle.hero_energy >= cost, 'Not enough energy');
        battle.hero_energy -= cost;
    }

    fn heal_hero(ref battle: Battle, amount: u8) {
        battle.hero_health += amount;
    }

    fn increase_hero_energy(ref battle: Battle, amount: u8) {
        battle.hero_energy += amount;
    }

    fn damage_hero(ref battle: Battle, ref battle_effects: BattleEffects, amount: u8) {
        if amount <= battle_effects.hero_dmg_reduction {
            return;
        }

        let damage = amount - battle_effects.hero_dmg_reduction;

        if battle.hero_health < damage {
            battle.hero_health = 0;
        } else {
            battle.hero_health -= damage;
        }
    }

    fn damage_monster(ref battle: Battle, ref battle_effects: BattleEffects, amount: u8) {
        let mut damage = amount + battle_effects.enemy_marks;

        if battle.monster_health < damage {
            battle.monster_health = 0;
        } else {
            battle.monster_health -= damage;
        }
    }

    fn damage_creature(ref creature: Creature, board_stats: BoardStats, mut amount: u8) {
        let mut reduction = 0;

        if creature.card_id == 27 {
            reduction += 1;

            if board_stats.brute_count > 1 {
                reduction += 1;
            }
        }

        if reduction >= amount {
            return;
        }

        amount -= reduction;

        if creature.health < amount {
            creature.health = 0;
        } else {
            creature.health -= amount;
        }
    }
}