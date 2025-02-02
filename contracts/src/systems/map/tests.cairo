use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::world::{WorldStorage, WorldStorageTrait};
use dojo_cairo_test::{NamespaceDef, TestResource, ContractDefTrait};

use starknet::{ContractAddress, contract_address_const};

use darkshuffle::models::game::{Game, GameState};
use darkshuffle::models::map::{Map};

use darkshuffle::utils::testing::{
    world::spawn_darkshuffle, systems::{deploy_system, deploy_map_systems},
    general::{create_game},
};
use darkshuffle::systems::map::contracts::{map_systems, IMapSystemsDispatcher, IMapSystemsDispatcherTrait};

fn setup() -> (WorldStorage, u128, IMapSystemsDispatcher) {
    let mut world = spawn_darkshuffle();
    let map_systems_dispatcher = deploy_map_systems(ref world);

    let game_id = create_game(ref world, 1, GameState::Map);

    (world, game_id, map_systems_dispatcher)
}

#[test]
#[available_gas(3000000000000)]
fn map_test_generate_map() {
    let (mut world, game_id, map_systems_dispatcher) = setup();

    let mut game: Game = world.read_model(game_id);
    game.state = GameState::Map;
    world.write_model_test(@game);

    map_systems_dispatcher.generate_tree(game_id);

    let game: Game = world.read_model(game_id);
    let map: Map = world.read_model((game.game_id, game.map_level));

    assert(map.seed != 0, 'Map seed is not set');
}