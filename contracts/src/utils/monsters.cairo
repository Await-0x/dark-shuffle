use darkshuffle::models::battle::{Battle, BattleEffects};
use darkshuffle::utils::{
    battle::BattleUtilsImpl,
    hand::HandUtilsImpl,
    random
};

#[generate_trait]
impl MonsterUtilsImpl of MonsterUtilsTrait {
    fn monster_ability(ref battle: Battle, ref battle_effects: BattleEffects, seed: u128) {
        if battle.monster_id == 1 {
            let random_card = random::get_random_number(seed, battle.hand.len().try_into().unwrap()) - 1;
            HandUtilsImpl::remove_hand_card(ref battle, *battle.hand.at(random_card.into()));
        }

        else if battle.monster_id == 2 {
            BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, battle.hand.len().try_into().unwrap());
        }
    }
}