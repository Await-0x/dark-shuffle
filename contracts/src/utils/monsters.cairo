use darkshuffle::models::battle::{Battle, BattleEffects};
use darkshuffle::utils::battle::BattleUtilsImpl;

#[generate_trait]
impl MonsterUtilsImpl of MonsterUtilsTrait {
    fn monster_ability(ref battle: Battle, ref battle_effects: BattleEffects) {
        BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, battle.monster_attack);
    }
}