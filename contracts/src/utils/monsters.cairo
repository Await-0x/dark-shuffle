mod monster_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, BattleEffects};
    use darkshuffle::utils::{
        board::board_utils,
        battle::battle_utils
    };

    fn monster_ability(world: IWorldDispatcher, ref battle: Battle, ref battle_effects: BattleEffects) {
        if battle.monster_id == 1 {
            battle.monster_attack += 2;
        }

        if battle.monster_id == 2 {
            battle.monster_health += 4;
        }

        if battle.monster_id == 6 {
            board_utils::damage_board(world, battle.battle_id, 2);
        }

        if battle.monster_id == 7 {
            battle.monster_health += board_utils::count_board(world, battle.battle_id) + 1;
            board_utils::damage_board(world, battle.battle_id, 1);
            battle_utils::damage_hero(ref battle, 1, ref battle_effects);
        }

        if battle.monster_id == 14 {
            battle.monster_attack = battle.monster_health;
        }

        if battle.monster_id == 16 {
            battle.hero_burn += 1;
        }

        let mut monster_attack = battle.monster_attack;

        if battle.monster_id == 18 && battle.monster_health < 30 {
            monster_attack *= 2;
        }

        if battle.monster_id == 19 {
            battle_utils::piercing_damage_hero(ref battle, battle.branch, ref battle_effects);
            monster_attack -= battle.branch;
        }

        if battle.monster_id == 21 && battle.monster_health > 50 {
            monster_attack += 10;
        }

        battle_utils::damage_hero(ref battle, monster_attack, ref battle_effects);
    }
}