use darkshuffle::models::battle::{Battle, BattleEffects, Creature, Card, Board, BoardStats, CreatureType, RoundStats};
use darkshuffle::models::game::GameEffects;
use darkshuffle::utils::{
    battle::BattleUtilsImpl,
    board::BoardUtilsImpl
};

#[generate_trait]
impl SummonUtilsImpl of SummonUtilsTrait {
    fn summon_creature(
        card: Card,
        ref battle: Battle,
        ref battle_effects: BattleEffects,
        ref board: Board,
        ref board_stats: BoardStats,
        ref round_stats: RoundStats,
        game_effects: GameEffects
    ) -> Creature {
        let mut creature: Creature = Creature {
            card_id: card.card_id,
            cost: card.cost,
            attack: card.attack,
            health: card.health,
            creature_type: card.creature_type,
        };

        if round_stats.creatures_played == 0 {
            creature.attack += game_effects.first_attack;
            creature.health += game_effects.first_health;
        }

        if game_effects.play_creature_heal > 0 {
            BattleUtilsImpl::heal_hero(ref battle, game_effects.play_creature_heal);
        }

        creature.attack += game_effects.all_attack;

        if creature.creature_type == CreatureType::Hunter {
            creature.attack += game_effects.hunter_attack;
            creature.health += game_effects.hunter_health;

            creature.attack += battle_effects.next_hunter_attack_bonus;
            creature.health += battle_effects.next_hunter_health_bonus;
            battle_effects.next_hunter_attack_bonus = 0;
            battle_effects.next_hunter_health_bonus = 0;

            if battle.monster_id == 73 {
                battle.monster_attack += 1;
            } else if battle.monster_id == 72 {
                battle.monster_health += 2;
            }

        } else if creature.creature_type == CreatureType::Brute {
            creature.health += game_effects.brute_health;
            creature.attack += game_effects.brute_attack;

            creature.health += battle_effects.next_brute_health_bonus;
            creature.attack += battle_effects.next_brute_attack_bonus;
            battle_effects.next_brute_health_bonus = 0;
            battle_effects.next_brute_attack_bonus = 0;

            if battle.monster_id == 63 {
                battle.monster_attack += 1;
            } else if battle.monster_id == 62 {
                battle.monster_health += 2;
            }
        } else if creature.creature_type == CreatureType::Magical {
            creature.health += game_effects.magical_health;
            creature.attack += game_effects.magical_attack;

            if battle.monster_id == 68 {
                battle.monster_attack += 1;
            } else if battle.monster_id == 67 {
                battle.monster_health += 2;
            }
        }

        if card.card_id == 1 {
            if board_stats.magical_count == 0 {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 2);
            } else {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 2, 0);
            }
        }

        else if card.card_id == 4 {
            BoardUtilsImpl::update_creatures(ref board, CreatureType::All, 2, 0);
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 3, creature.creature_type);
            }
        }
        
        else if card.card_id == 7 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.enemy_marks += 3;
            } else {
                battle_effects.enemy_marks += 2;
            }
        }
        
        else if card.card_id == 9 {
            if battle.monster_type == CreatureType::Magical {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 4, creature.creature_type);
            } else {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 2, creature.creature_type);
            }
        }

        else if card.card_id == 12 {
            battle_effects.hero_dmg_reduction += 1;
        }

        else if card.card_id == 14 {
            if board_stats.brute_count > 0 {
                creature.health += 2;
            }
        }

        else if card.card_id == 17 {
            if battle.monster_type == CreatureType::Brute {
                creature.attack += 1;
            }

            if board_stats.magical_count > 0 {
                creature.attack += 1;
            }
        }

        else if card.card_id == 18 {
            if board_stats.magical_count > 0 {
                BattleUtilsImpl::increase_hero_energy(ref battle, 1);
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }

        else if card.card_id == 22 {
            if board_stats.hunter_count == 0 {
                creature.attack += 2;
            }
        }

        else if card.card_id == 24 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.enemy_marks += 2;
            } else {
                battle_effects.enemy_marks += 1;
            }
        }

        else if card.card_id == 31 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 0, 1);
            }
        }

        else if card.card_id == 34 {
            BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 1, 0);

            if board_stats.magical_count >= 2 {
                battle.hero_energy += 1;
            }
        }

        else if card.card_id == 36 {
            battle_effects.enemy_marks += 1;
        }

        else if card.card_id == 39 {
            if board_stats.hunter_count > 0 {
                creature.attack += 1;
            }

            if battle.monster_type == CreatureType::Magical {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Hunter, 1, 0);
            }
        }

        else if card.card_id == 42 {
            if board_stats.brute_count > 0 {
                creature.attack += 1;
            }

            if battle.monster_type == CreatureType::Hunter {
                creature.health += 1;
            }
        }

        else if card.card_id == 44 {
            if board_stats.brute_count > 0 {
                creature.attack += 1;
            }

            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }

        else if card.card_id == 47 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }

        else if card.card_id == 49 {
            BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 1, 0);
        }

        else if card.card_id == 51 {
            if battle.monster_type == CreatureType::Magical {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 1, creature.creature_type);
            }
        }

        else if card.card_id == 54 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.enemy_marks += 1;
            }
        }

        else if card.card_id == 58 {
            if board_stats.brute_count > 0 {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }

        else if card.card_id == 59 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }
        
        else if card.card_id == 63 {
            if battle.monster_type == CreatureType::Brute {
                creature.attack += 2;
            }
        }

        else if card.card_id == 66 {
            if battle.monster_type == CreatureType::Magical {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 1, creature.creature_type);
            }
        }

        else if card.card_id == 70 {
            if board_stats.hunter_count > 0 {
                creature.attack += 1;
            }
        }

        else if card.card_id == 72 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 1, creature.creature_type);
            }
        }

        else if card.card_id == 74 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }

        if battle.monster_id == 55 {
            if creature.health > creature.attack {
                BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, game_effects, 2);
            }
        }

        round_stats.creatures_played += 1;
        creature
    }
}