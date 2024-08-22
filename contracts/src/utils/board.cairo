mod board_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Creature, Board, Battle, BattleEffects};
    use darkshuffle::utils::battle::battle_utils;

    fn add_creature_to_board(creature_id: u16, battle_id: usize, world: IWorldDispatcher) {
        let mut board: Board = get!(world, (battle_id), Board);

        if board.creature1 == 0 {
            board.creature1 = creature_id;
        }
        
        else if board.creature2 == 0 {
            board.creature2 = creature_id;
        }

        else if board.creature3 == 0 {
            board.creature3 = creature_id;
        }

        else if board.creature4 == 0 {
            board.creature4 = creature_id;
        }

        else if board.creature5 == 0 {
            board.creature5 = creature_id;
        }

        else if board.creature6 == 0 {
            board.creature6 = creature_id;
        }

        else {
            panic(array!['Board is full']);
        }

        set!(world, (board));
    }

    fn attack_monster(world: IWorldDispatcher, ref battle: Battle, ref battle_effects: BattleEffects) {
        let mut board: Board = get!(world, (battle.battle_id), Board);

        if board.creature1 != 0 {
            let mut creature1: Creature = get!(world, (battle.battle_id, board.creature1), Creature);
            if creature1.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature1.attack, 2);
                battle_utils::damage_creature(ref creature1, battle.monster_attack);
                if creature1.health == 0 {
                    board.creature1 = 0;
                    delete!(world, (creature1));
                }
            }
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = get!(world, (battle.battle_id, board.creature2), Creature);
            if creature2.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature2.attack, 2);
                battle_utils::damage_creature(ref creature2, battle.monster_attack);
                if creature2.health == 0 {
                    board.creature2 = 0;
                    delete!(world, (creature2));
                }
            }
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = get!(world, (battle.battle_id, board.creature3), Creature);
            if creature3.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature3.attack, 2);
                battle_utils::damage_creature(ref creature3, battle.monster_attack);
                if creature3.health == 0 {
                    board.creature3 = 0;
                    delete!(world, (creature3));
                }
            }
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = get!(world, (battle.battle_id, board.creature4), Creature);
            if creature4.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature4.attack, 2);
                battle_utils::damage_creature(ref creature4, battle.monster_attack);
                if creature4.health == 0 {
                    board.creature4 = 0;
                    delete!(world, (creature4));
                }
            }
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = get!(world, (battle.battle_id, board.creature5), Creature);
            if creature5.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature5.attack, 2);
                battle_utils::damage_creature(ref creature5, battle.monster_attack);
                if creature5.health == 0 {
                    board.creature5 = 0;
                    delete!(world, (creature5));
                }
            }
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = get!(world, (battle.battle_id, board.creature6), Creature);
            if creature6.resting_round < battle.round {
                battle_utils::damage_monster(ref battle, ref battle_effects, creature6.attack, 2);
                battle_utils::damage_creature(ref creature6, battle.monster_attack);
                if creature6.health == 0 {
                    board.creature6 = 0;
                    delete!(world, (creature6));
                }
            }
        }

        set!(world, (board));
    }

    fn count_board(world: IWorldDispatcher, battle_id: usize) -> u16 {
        let mut board: Board = get!(world, (battle_id), Board);
        let mut count = 0;

        if board.creature1 != 0 {
            count += 1;
        }
        
        if board.creature2 != 0 {
            count += 1;
        }

        if board.creature3 != 0 {
            count += 1;
        }

        if board.creature4 != 0 {
            count += 1;
        }

        if board.creature5 != 0 {
            count += 1;
        }

        if board.creature6 != 0 {
            count += 1;
        }

        count
    }

    fn update_creatures(world: IWorldDispatcher, battle_id: usize, attack: u16, health: u16) {
        let mut board: Board = get!(world, (battle_id), Board);

        if board.creature1 != 0 {
            let mut creature1: Creature = get!(world, (battle_id, board.creature1), Creature);
            creature1.attack += attack;
            creature1.health += health;
            set!(world, (creature1));
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = get!(world, (battle_id, board.creature2), Creature);
            creature2.attack += attack;
            creature2.health += health;
            set!(world, (creature2));
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = get!(world, (battle_id, board.creature3), Creature);
            creature3.attack += attack;
            creature3.health += health;
            set!(world, (creature3));
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = get!(world, (battle_id, board.creature4), Creature);
            creature4.attack += attack;
            creature4.health += health;
            set!(world, (creature4));
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = get!(world, (battle_id, board.creature5), Creature);
            creature5.attack += attack;
            creature5.health += health;
            set!(world, (creature5));
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = get!(world, (battle_id, board.creature6), Creature);
            creature6.attack += attack;
            creature6.health += health;
            set!(world, (creature6));
        }
    }

    fn damage_board(world: IWorldDispatcher, battle_id: usize, damage: u16) {
        let mut board: Board = get!(world, (battle_id), Board);

        if board.creature1 != 0 {
            let mut creature1: Creature = get!(world, (battle_id, board.creature1), Creature);

            if creature1.health <= damage {
                board.creature1 = 0;
                delete!(world, (creature1));
            } else {
                creature1.health -= damage;
                set!(world, (creature1));
            }
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = get!(world, (battle_id, board.creature2), Creature);

            if creature2.health <= damage {
                board.creature2 = 0;
                delete!(world, (creature2));
            } else {
                creature2.health -= damage;
                set!(world, (creature2));
            }
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = get!(world, (battle_id, board.creature3), Creature);

            if creature3.health <= damage {
                board.creature3 = 0;
                delete!(world, (creature3));
            } else {
                creature3.health -= damage;
                set!(world, (creature3));
            }
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = get!(world, (battle_id, board.creature4), Creature);

            if creature4.health <= damage {
                board.creature4 = 0;
                delete!(world, (creature4));
            } else {
                creature4.health -= damage;
                set!(world, (creature4));
            }
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = get!(world, (battle_id, board.creature5), Creature);

            if creature5.health <= damage {
                board.creature5 = 0;
                delete!(world, (creature5));
            } else {
                creature5.health -= damage;
                set!(world, (creature5));
            }
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = get!(world, (battle_id, board.creature6), Creature);

            if creature6.health <= damage {
                board.creature6 = 0;
                delete!(world, (creature6));
            } else {
                creature6.health -= damage;
                set!(world, (creature6));
            }
        }

        set!(world, (board));
    }
}