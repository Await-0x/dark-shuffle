use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use darkshuffle::models::game::{Game};
use darkshuffle::models::battle::{Battle};

use darkshuffle::utils::{
    season::SeasonUtilsImpl
};

#[generate_trait]
impl GameUtilsImpl of GameUtilsTrait {
    fn is_battle_over(battle: Battle) -> bool {
        if battle.monster_health > 0 && battle.hero_health > 0 {
            return false;
        }

        true
    }

    fn end_battle(ref world: WorldStorage, ref battle: Battle) {
        if battle.hero_health == 0 {
            Self::battle_lost(ref world, ref battle);
        } else if battle.monster_health == 0 {
            Self::battle_won(ref world, ref battle);
        }

        world.write_model(@battle);
    }

    fn battle_won(ref world: WorldStorage, ref battle: Battle) {
        let mut game: Game = world.read_model((battle.game_id));

        game.monsters_slain += 1;
        game.in_battle = false;
        game.active_battle_id = 0;
        game.hero_health = battle.hero_health;
        game.map_depth += 1;

        world.write_model(@game);
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
}