mod monster_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Monster, Battle};
    use darkshuffle::utils::{
        board::board_utils,
        battle::battle_utils
    };

    fn get_monster(battles_won: u16) -> Monster {
        let id: u16 = battles_won % 7;

        let mut bonus_attack = 0;
        let mut bonus_health = 0;

        bonus_attack += battles_won / 7 * 2;
        bonus_health += battles_won / 7 * 20;
        
        if id == 0 {
            return Monster {
                monster_id: 401,
                attack: 1 + bonus_attack,
                health: 50 + bonus_health,
            };
        }

        if id == 1 {
            return Monster {
                monster_id: 402,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        if id == 2 {
            return Monster {
                monster_id: 403,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        if id == 3 {
            return Monster {
                monster_id: 404,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        if id == 4 {
            return Monster {
                monster_id: 405,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        if id == 5 {
            return Monster {
                monster_id: 406,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        if id == 6 {
            return Monster {
                monster_id: 407,
                attack: 4 + bonus_attack,
                health: 50 + bonus_health
            };
        }

        Monster {
            monster_id: 0,
            attack: 0,
            health: 0
        }
    }

    fn monster_ability(world: IWorldDispatcher, ref battle: Battle) {
        if battle.monster_id == 401 {
            battle.monster_attack += 1;
        }

        if battle.monster_id == 402 {
            battle.monster_health += 4;
        }

        if battle.monster_id == 406 {
            board_utils::damage_board(world, battle.battle_id, 2);
        }

        if battle.monster_id == 407 {
            battle.monster_health += board_utils::count_board(world, battle.battle_id) + 1;
            board_utils::damage_board(world, battle.battle_id, 1);
            battle_utils::damage_hero(ref battle, 1);
        }
    }
}