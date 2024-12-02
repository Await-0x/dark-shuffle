use darkshuffle::models::game::GameEffects;
use darkshuffle::models::battle::{Battle, BattleEffects, RoundStats, BoardStats, Board};
use darkshuffle::utils::{
    battle::BattleUtilsImpl,
    hand::HandUtilsImpl,
    board::BoardUtilsImpl,
    random
};

#[generate_trait]
impl MonsterUtilsImpl of MonsterUtilsTrait {
    fn monster_ability(
        ref battle: Battle,
        ref battle_effects: BattleEffects,
        game_effects: GameEffects,
        board: Board,
        board_stats: BoardStats,
        round_stats: RoundStats,
        seed: u128
    ) {
        if battle.monster_id == 1 {
            let random_card = random::get_random_number(seed, battle.hand.len().try_into().unwrap()) - 1;
            HandUtilsImpl::remove_hand_card(ref battle, *battle.hand.at(random_card.into()));
        }

        else if battle.monster_id == 2 {
            BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, game_effects, battle.hand.len().try_into().unwrap());
        }

        else if battle.monster_id == 14 {
            battle.monster_attack += battle.hand.len().try_into().unwrap();
        }

        else if battle.monster_id == 15 {
            battle.monster_attack += round_stats.creature_attack_count;
        }

        else if battle.monster_id == 30 && battle.monster_health >= round_stats.monster_start_health {
            BattleUtilsImpl::damage_hero(ref battle, ref battle_effects, game_effects, 3);
        }

        else if battle.monster_id == 57 {
            let mut strongest_creature = BoardUtilsImpl::get_strongest_creature(board);
            BattleUtilsImpl::damage_creature(ref strongest_creature, board_stats, strongest_creature.attack, battle.monster_id);
        }

        else if battle.monster_id == 58 {
            let strongest_creature = BoardUtilsImpl::get_strongest_creature(board);

            if strongest_creature.attack > battle.monster_attack {
                battle.monster_attack += 1;
            }
        }

        else if battle.monster_id == 59 {
            if battle.monster_health >= round_stats.monster_start_health {
                battle.monster_attack += 2;
            }
        }
    }
}