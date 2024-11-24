use darkshuffle::models::battle::{Battle, BattleEffects, Creature, Board, BoardStats, CreatureType};
use darkshuffle::utils::{
    battle::BattleUtilsImpl,
    board::BoardUtilsImpl
};

#[generate_trait]
impl DeathUtilsImpl of DeathUtilsTrait {
    fn creature_death(
        creature: Creature,
        ref battle: Battle,
        ref battle_effects: BattleEffects,
        ref board: Board,
        board_stats: BoardStats
    ) {
        if creature.card_id == 3 {
            BattleUtilsImpl::reduce_monster_attack(ref battle, 2);

            if battle.monster_type == CreatureType::Brute {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 2, 0);
            }
        }

        else if creature.card_id == 10 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.next_hunter_attack_bonus += 4;
            } else {
                battle_effects.next_hunter_attack_bonus += 2;
            }
        }

        else if creature.card_id == 11 {
            BoardUtilsImpl::update_creatures(ref board, CreatureType::Brute, 2, 0);

            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 2);
            }
        }

        else if creature.card_id == 15 {
            if battle.monster_type == CreatureType::Hunter {
                battle_effects.next_brute_health_bonus += 5;
            } else {
                battle_effects.next_brute_health_bonus += 3;
            }
        }

        else if creature.card_id == 16 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }

            BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 1, 0);
        }

        else if creature.card_id == 19 {
            BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, 2, creature.creature_type);

            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }

        else if creature.card_id == 25 {
            battle_effects.next_hunter_attack_bonus += 2;

            if battle.monster_type == CreatureType::Magical {
                battle_effects.next_hunter_health_bonus += 2;
            }
        }

        else if creature.card_id == 26 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::heal_hero(ref battle, 2);
            }
        }

        else if creature.card_id == 29 {
            battle_effects.next_brute_health_bonus += 2;
        }

        else if creature.card_id == 30 {
            battle_effects.next_brute_attack_bonus += 1;
        }

        else if creature.card_id == 33 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }

            BoardUtilsImpl::update_creatures(ref board, CreatureType::Magical, 1, 0);
        }

        else if creature.card_id == 38 {
            battle_effects.next_hunter_attack_bonus += 1;

            if battle.monster_type == CreatureType::Magical {
                battle_effects.next_hunter_health_bonus += 1;
            }
        }

        else if creature.card_id == 41 {
            if battle.monster_type == CreatureType::Hunter {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Brute, 1, 0);
            }
        }

        else if creature.card_id == 45 {
            if battle.monster_type == CreatureType::Hunter {
                if board_stats.brute_count == 1 {
                    BattleUtilsImpl::heal_hero(ref battle, 2);
                } else {
                    BattleUtilsImpl::heal_hero(ref battle, 1);
                }
            }
        }

        else if creature.card_id == 48 {
            if board_stats.magical_count > 1 {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }

        else if creature.card_id == 53 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.next_hunter_attack_bonus += 1;
            }
        }

        else if creature.card_id == 56 {
            if battle.monster_type == CreatureType::Hunter {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Brute, 1, 0);
            }
        }

        else if creature.card_id == 60 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }

        else if creature.card_id == 61 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::reduce_monster_attack(ref battle, 1);
            }
        }

        else if creature.card_id == 64 {
            if battle.monster_type == CreatureType::Brute {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }

        else if creature.card_id == 68 {
            if battle.monster_type == CreatureType::Magical {
                battle_effects.next_hunter_attack_bonus += 1;
            }
        }

        else if creature.card_id == 71 {
            if battle.monster_type == CreatureType::Hunter {
                BoardUtilsImpl::update_creatures(ref board, CreatureType::Brute, 1, 0);
            }
        }

        else if creature.card_id == 73 {
            if battle.monster_type == CreatureType::Hunter {
                BattleUtilsImpl::heal_hero(ref battle, 1);
            }
        }
    }
}