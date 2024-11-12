use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use darkshuffle::models::battle::{Battle, BattleEffects};
use darkshuffle::utils::{
    board::BoardUtilsImpl,
    battle::BattleUtilsImpl
};

#[generate_trait]
impl MonsterUtilsImpl of MonsterUtilsTrait {
    fn monster_ability(ref world: WorldStorage, ref battle: Battle, ref battle_effects: BattleEffects) {
        if battle.monster_id == 1 {
            battle.monster_attack += 2;
        }

        if battle.monster_id == 2 {
            battle.monster_health += (5 + battle.branch);
        }

        if battle.monster_id == 6 {
            BoardUtilsImpl::damage_board(ref world, battle.battle_id, battle.branch + 1);
        }

        if battle.monster_id == 7 {
            battle.monster_health += (BoardUtilsImpl::count_board(ref world, battle.battle_id) + 1) * battle.branch;
            BoardUtilsImpl::damage_board(ref world, battle.battle_id, battle.branch);
            BattleUtilsImpl::damage_hero(ref battle, battle.branch, ref battle_effects);
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
            BattleUtilsImpl::piercing_damage_hero(ref battle, battle.branch, ref battle_effects);
            monster_attack -= battle.branch;
        }

        if battle.monster_id == 21 && battle.monster_health > 50 {
            monster_attack += 10;
        }

        BattleUtilsImpl::damage_hero(ref battle, monster_attack, ref battle_effects);
    }
}