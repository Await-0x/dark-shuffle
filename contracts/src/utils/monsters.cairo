mod monster_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Monster, Battle};
    use darkshuffle::utils::{
        board::board_utils,
        battle::battle_utils
    };

    fn monster_ability(world: IWorldDispatcher, ref battle: Battle) {
        if battle.monster_id == 401 {
            battle.monster_attack += 2;
        } else {
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