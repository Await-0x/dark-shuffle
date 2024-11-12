use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use darkshuffle::models::battle::{Creature, Board, Battle, BattleEffects};
use darkshuffle::utils::battle::BattleUtilsImpl;

#[generate_trait]
impl BoardUtilsImpl of BoardUtilsTrait {
    fn add_creature_to_board(ref world: WorldStorage, creature_id: u16, battle_id: usize) {
        let mut board: Board = world.read_model((battle_id));

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

        world.write_model(@board);
    }

    fn attack_monster(ref world: WorldStorage, ref battle: Battle, ref battle_effects: BattleEffects) {
        let mut board: Board = world.read_model((battle.battle_id));

        if board.creature1 != 0 {
            let mut creature1: Creature = world.read_model((battle.battle_id, board.creature1));
            if creature1.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature1.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature1, battle.monster_attack);
                if creature1.health == 0 {
                    board.creature1 = 0;
                    world.erase_model(@creature1);
                }
            }
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = world.read_model((battle.battle_id, board.creature2));
            if creature2.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature2.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature2, battle.monster_attack);
                if creature2.health == 0 {
                    board.creature2 = 0;
                    world.erase_model(@creature2);
                }
            }
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = world.read_model((battle.battle_id, board.creature3));
            if creature3.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature3.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature3, battle.monster_attack);
                if creature3.health == 0 {
                    board.creature3 = 0;
                    world.erase_model(@creature3);
                }
            }
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = world.read_model((battle.battle_id, board.creature4));
            if creature4.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature4.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature4, battle.monster_attack);
                if creature4.health == 0 {
                    board.creature4 = 0;
                    world.erase_model(@creature4);
                }
            }
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = world.read_model((battle.battle_id, board.creature5));
            if creature5.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature5.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature5, battle.monster_attack);
                if creature5.health == 0 {
                    board.creature5 = 0;
                    world.erase_model(@creature5);
                }
            }
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = world.read_model((battle.battle_id, board.creature6));
            if creature6.resting_round < battle.round {
                BattleUtilsImpl::damage_monster(ref battle, ref battle_effects, creature6.attack, 2);
                BattleUtilsImpl::damage_creature(ref creature6, battle.monster_attack);
                if creature6.health == 0 {
                    board.creature6 = 0;
                    world.erase_model(@creature6);
                }
            }
        }

        world.write_model(@board);
    }

    fn count_board(ref world: WorldStorage, battle_id: usize) -> u16 {
        let mut board: Board = world.read_model(battle_id);
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

    fn update_creatures(ref world: WorldStorage, battle_id: usize, attack: u16, health: u16) {
        let mut board: Board = world.read_model(battle_id);

        if board.creature1 != 0 {
            let mut creature1: Creature = world.read_model((battle_id, board.creature1));
            creature1.attack += attack;
            creature1.health += health;
            world.write_model(@creature1);
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = world.read_model((battle_id, board.creature2));
            creature2.attack += attack;
            creature2.health += health;
            world.write_model(@creature2);
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = world.read_model((battle_id, board.creature3));
            creature3.attack += attack;
            creature3.health += health;
            world.write_model(@creature3);
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = world.read_model((battle_id, board.creature4));
            creature4.attack += attack;
            creature4.health += health;
            world.write_model(@creature4);
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = world.read_model((battle_id, board.creature5));
            creature5.attack += attack;
            creature5.health += health;
            world.write_model(@creature5);
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = world.read_model((battle_id, board.creature6));
            creature6.attack += attack;
            creature6.health += health;
            world.write_model(@creature6);
        }
    }

    fn damage_board(ref world: WorldStorage, battle_id: usize, damage: u16) {
        let mut board: Board = world.read_model(battle_id);

        if board.creature1 != 0 {
            let mut creature1: Creature = world.read_model((battle_id, board.creature1));

            if creature1.health <= damage {
                board.creature1 = 0;
                world.erase_model(@creature1);
            } else {
                creature1.health -= damage;
                world.write_model(@creature1);
            }
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = world.read_model((battle_id, board.creature2));

            if creature2.health <= damage {
                board.creature2 = 0;
                world.erase_model(@creature2);
            } else {
                creature2.health -= damage;
                world.write_model(@creature2);
            }
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = world.read_model((battle_id, board.creature3));

            if creature3.health <= damage {
                board.creature3 = 0;
                world.erase_model(@creature3);
            } else {
                creature3.health -= damage;
                world.write_model(@creature3);
            }
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = world.read_model((battle_id, board.creature4));

            if creature4.health <= damage {
                board.creature4 = 0;
                world.erase_model(@creature4);
            } else {
                creature4.health -= damage;
                world.write_model(@creature4);
            }
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = world.read_model((battle_id, board.creature5));

            if creature5.health <= damage {
                board.creature5 = 0;
                world.erase_model(@creature5);
            } else {
                creature5.health -= damage;
                world.write_model(@creature5);
            }
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = world.read_model((battle_id, board.creature6));

            if creature6.health <= damage {
                board.creature6 = 0;
                world.erase_model(@creature6);
            } else {
                creature6.health -= damage;
                world.write_model(@creature6);
            }
        }

        world.write_model(@board);
    }
}