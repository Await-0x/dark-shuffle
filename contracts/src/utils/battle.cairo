use darkshuffle::models::game::GameEffects;
use darkshuffle::models::battle::{Battle, BoardStats, Creature, Card, BattleEffects, BattleOwnerTrait, CardType, CreatureType, RoundStats};
use darkshuffle::constants::MAX_HEALTH;

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

    fn energy_cost(ref battle: Battle, ref battle_effects: BattleEffects, round_stats: RoundStats, game_effects: GameEffects, card: Card) {
        let mut cost = card.cost;

        if round_stats.creatures_played == 0 && game_effects.first_cost > 0 {
            if game_effects.first_cost >= cost {
                return;
            }

            cost -= game_effects.first_cost;
        }

        assert(battle.hero_energy >= cost, 'Not enough energy');
        battle.hero_energy -= cost;
    }

    fn heal_hero(ref battle: Battle, amount: u8) {
        if battle.hero_health + amount >= MAX_HEALTH {
            battle.hero_health = MAX_HEALTH;
        } else {
            battle.hero_health += amount;
        }
    }

    fn increase_hero_energy(ref battle: Battle, amount: u8) {
        battle.hero_energy += amount;
    }

    fn damage_hero(ref battle: Battle, ref battle_effects: BattleEffects, game_effects: GameEffects, amount: u8) {
        if amount <= battle_effects.hero_dmg_reduction {
            return;
        }

        let mut damage = amount - battle_effects.hero_dmg_reduction;

        if damage <= game_effects.hero_dmg_reduction {
            return;
        }

        damage -= game_effects.hero_dmg_reduction;

        if battle.hero_health < damage {
            battle.hero_health = 0;
        } else {
            battle.hero_health -= damage;
        }
    }

    fn damage_monster(ref battle: Battle, ref battle_effects: BattleEffects, amount: u8, creature_type: CreatureType) {
        let mut damage = amount + battle_effects.enemy_marks;
        
        if damage == 0 {
            return;
        }

        if battle.monster_id == 75 && creature_type == CreatureType::Hunter {
            damage -= 1;
        } else if battle.monster_id == 70 && creature_type == CreatureType::Magical {
            damage -= 1;
        } else if battle.monster_id == 65 && creature_type == CreatureType::Brute {
            damage -= 1;
        }

        if battle.monster_health < damage {
            battle.monster_health = 0;
        } else {
            battle.monster_health -= damage;
        }
    }

    fn damage_creature(ref creature: Creature, board_stats: BoardStats, mut amount: u8, monster_id: u8) {
        if monster_id == 74 && creature.creature_type == CreatureType::Hunter {
            amount += 1;
        } else if monster_id == 69 && creature.creature_type == CreatureType::Magical {
            amount += 1;
        } else if monster_id == 64 && creature.creature_type == CreatureType::Brute {
            amount += 1;
        }

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