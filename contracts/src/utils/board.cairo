mod board_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Creature, Board, Battle, Card};

    fn no_creature() -> Creature {
        Creature {
            battle_id: 0,
            creature_id: 0,
            card_id: 0,
            cost: 0,
            attack: 0,
            health: 0,
            shield: false,
            resting_round: 0,
        }
    }

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

    fn remove_creature(ref creature: Creature, battle_id: usize, world: IWorldDispatcher) {
        let mut board: Board = get!(world, (battle_id), Board);

        if board.creature1 == creature.creature_id {
            board.creature1 = 0;
        }
        
        else if board.creature2 == creature.creature_id {
            board.creature2 = 0;
        }

        else if board.creature3 == creature.creature_id {
            board.creature3 = 0;
        }

        else if board.creature4 == creature.creature_id {
            board.creature4 = 0;
        }

        else if board.creature5 == creature.creature_id {
            board.creature5 = 0;
        }

        else if board.creature6 == creature.creature_id {
            board.creature6 = 0;
        }


        delete!(world, (creature));
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
                delete!(world, (creature1));
                board.creature1 = 0;
            } else {
                creature1.health -= damage;
                set!(world, (creature1));
            }
        }
        
        if board.creature2 != 0 {
            let mut creature2: Creature = get!(world, (battle_id, board.creature2), Creature);

            if creature2.health <= damage {
                delete!(world, (creature2));
                board.creature2 = 0;
            } else {
                creature2.health -= damage;
                set!(world, (creature2));
            }
        }

        if board.creature3 != 0 {
            let mut creature3: Creature = get!(world, (battle_id, board.creature3), Creature);

            if creature3.health <= damage {
                delete!(world, (creature3));
                board.creature3 = 0;
            } else {
                creature3.health -= damage;
                set!(world, (creature3));
            }
        }

        if board.creature4 != 0 {
            let mut creature4: Creature = get!(world, (battle_id, board.creature4), Creature);

            if creature4.health <= damage {
                delete!(world, (creature4));
                board.creature4 = 0;
            } else {
                creature4.health -= damage;
                set!(world, (creature4));
            }
        }

        if board.creature5 != 0 {
            let mut creature5: Creature = get!(world, (battle_id, board.creature5), Creature);

            if creature5.health <= damage {
                delete!(world, (creature5));
                board.creature5 = 0;
            } else {
                creature5.health -= damage;
                set!(world, (creature5));
            }
        }

        if board.creature6 != 0 {
            let mut creature6: Creature = get!(world, (battle_id, board.creature6), Creature);

            if creature6.health <= damage {
                delete!(world, (creature6));
                board.creature6 = 0;
            } else {
                creature6.health -= damage;
                set!(world, (creature6));
            }
        }
    }
}