use dojo::model::ModelStorage;

use dojo::world::WorldStorage;
use dojo::world::WorldStorageTrait;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo_cairo_test::deploy_contract;

use darkshuffle::systems::{
    game::contracts::{game_systems, IGameSystemsDispatcher, IGameSystemsDispatcherTrait},
    map::contracts::{map_systems, IMapSystemsDispatcher, IMapSystemsDispatcherTrait},
    draft::contracts::{draft_systems, IDraftSystemsDispatcher, IDraftSystemsDispatcherTrait},
    config::contracts::{config_systems, IConfigSystemsDispatcher, IConfigSystemsDispatcherTrait},
    battle::contracts::{battle_systems, IBattleSystemsDispatcher, IBattleSystemsDispatcherTrait}
};
use darkshuffle::utils::testing::mock::gameTokenMock::{GameTokenMock};

use starknet::{ContractAddress};

fn deploy_system(ref world: WorldStorage, name: ByteArray) -> ContractAddress {
    let (contract_address, _) = world.dns(@name).unwrap();
    contract_address
}

fn deploy_game_systems(ref world: WorldStorage) -> IGameSystemsDispatcher {
    let game_systems_address = deploy_system(ref world, "game_systems");
    let game_systems_dispatcher = IGameSystemsDispatcher { contract_address: game_systems_address };

    game_systems_dispatcher
}

fn deploy_map_systems(ref world: WorldStorage) -> IMapSystemsDispatcher {
    let map_systems_address = deploy_system(ref world, "map_systems");
    let map_systems_dispatcher = IMapSystemsDispatcher { contract_address: map_systems_address };

    map_systems_dispatcher
}

fn deploy_draft_systems(ref world: WorldStorage) -> IDraftSystemsDispatcher {
    let draft_systems_address = deploy_system(ref world, "draft_systems");
    let draft_systems_dispatcher = IDraftSystemsDispatcher { contract_address: draft_systems_address };

    draft_systems_dispatcher
}

fn deploy_battle_systems(ref world: WorldStorage) -> IBattleSystemsDispatcher {
    let battle_systems_address = deploy_system(ref world, "battle_systems");
    let battle_systems_dispatcher = IBattleSystemsDispatcher { contract_address: battle_systems_address };

    battle_systems_dispatcher
}

fn deploy_config_systems(ref world: WorldStorage) -> IConfigSystemsDispatcher {
    let config_systems_address = deploy_system(ref world, "config_systems");
    let config_systems_dispatcher = IConfigSystemsDispatcher {
        contract_address: config_systems_address
    };

    config_systems_dispatcher
}

fn deploy_game_token_mock(ref world: WorldStorage) -> ContractAddress {
    let call_data: Array<felt252> = array![];
    let game_token_address = deploy_contract(GameTokenMock::TEST_CLASS_HASH, call_data.span());

    game_token_address
}