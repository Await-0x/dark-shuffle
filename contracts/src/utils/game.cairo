use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use darkshuffle::models::game::{Game, GameEffects};
use darkshuffle::models::battle::{Battle};

use darkshuffle::utils::{
    season::SeasonUtilsImpl,
    battle::BattleUtilsImpl
};

#[generate_trait]
impl GameUtilsImpl of GameUtilsTrait {
    fn is_battle_over(battle: Battle) -> bool {
        if battle.monster_health > 0 && battle.hero_health > 0 {
            return false;
        }

        true
    }

    fn end_battle(ref world: WorldStorage, ref battle: Battle, ref game_effects: GameEffects) {
        if battle.hero_health == 0 {
            Self::battle_lost(ref world, ref battle);
        } else if battle.monster_health == 0 {
            Self::battle_won(ref world, ref battle, ref game_effects);
        }

        world.write_model(@battle);
    }

    fn battle_won(ref world: WorldStorage, ref battle: Battle, ref game_effects: GameEffects) {
        Self::add_monster_reward(ref game_effects, ref battle);

        let mut game: Game = world.read_model((battle.game_id));

        game.monsters_slain += 1;
        game.in_battle = false;
        game.active_battle_id = 0;
        game.map_depth += 1;
        game.hero_health = battle.hero_health;

        world.write_model(@game);
        world.write_model(@game_effects);
    }
    
    fn battle_lost(ref world: WorldStorage, ref battle: Battle) {
        let mut game: Game = world.read_model((battle.game_id));

        game.in_battle = false;
        game.active = false;
        game.active_battle_id = 0;
        game.hero_health = 0;

        SeasonUtilsImpl::score_game(ref world, game);
        world.write_model(@game);
    }

    fn add_monster_reward(ref game_effects: GameEffects, ref battle: Battle) {
        if battle.monster_id == 1 {
            game_effects.card_draw += 1;
        }

        else if battle.monster_id == 2 {
            game_effects.hero_card_heal = true;
        }

        else if battle.monster_id == 3 {
            game_effects.brute_health += 2;
            game_effects.brute_attack += 2;
        }

        else if battle.monster_id == 15 {
            game_effects.play_creature_heal += 1;
        }

        else if battle.monster_id == 20 {
            game_effects.all_attack += 1;
        }

        else if battle.monster_id == 30 {
            game_effects.first_cost += 1;
        }

        else if battle.monster_id == 55 {
            game_effects.first_attack += 1;
        }

        else if battle.monster_id == 57 {
            game_effects.first_health += 2;
        }

        else if battle.monster_id == 58 {
            game_effects.hero_dmg_reduction += 1;
        }

        else if battle.monster_id == 59 {
            game_effects.start_bonus_energy += 1;
        }
        
        else if battle.monster_id == 62 || battle.monster_id == 64 {
            game_effects.brute_health += 1;
        }
        
        else if battle.monster_id == 63 || battle.monster_id == 65 {
            game_effects.brute_attack += 1;
        }
        
        else if battle.monster_id == 67 || battle.monster_id == 69 {
            game_effects.magical_health += 1;
        }

        else if battle.monster_id == 68 || battle.monster_id == 70 {
            game_effects.magical_attack += 1;
        }
        
        else if battle.monster_id == 72 || battle.monster_id == 74 {
            game_effects.hunter_health += 1;
        }

        else if battle.monster_id == 73 || battle.monster_id == 75 {
            game_effects.hunter_attack += 1;
        }

        // Heal rewards
        else if battle.monster_id == 4 || battle.monster_id == 5 || battle.monster_id == 6 ||
                battle.monster_id == 7 || battle.monster_id == 8 || battle.monster_id == 9 ||
                battle.monster_id == 10 || battle.monster_id == 11 || battle.monster_id == 12 ||
                battle.monster_id == 13 || battle.monster_id == 14 ||
                battle.monster_id == 16 || battle.monster_id == 21 || battle.monster_id == 26
        {
            BattleUtilsImpl::heal_hero(ref battle, 20);
        }

        else if battle.monster_id == 31 || battle.monster_id == 36 || battle.monster_id == 41 {
            BattleUtilsImpl::heal_hero(ref battle, 15);
        }
        
        else if battle.monster_id == 46 || battle.monster_id == 51 || battle.monster_id == 56 {
            BattleUtilsImpl::heal_hero(ref battle, 10);
        }
        
        else if battle.monster_id == 61 || battle.monster_id == 66 || battle.monster_id == 71 {
            BattleUtilsImpl::heal_hero(ref battle, 5);
        }
        
    }
}
