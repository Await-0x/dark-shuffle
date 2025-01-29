#[starknet::interface]
trait IMapContract<T> {
    fn generate_tree(ref self: T, game_id: u128);
    fn select_node(ref self: T, game_id: u128, node_id: u8);
}

#[dojo::contract]
mod map_systems {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::models::game::{Game, GameOwnerTrait, GameActionEvent};
    use darkshuffle::models::map::{Map, MonsterNode};
    use darkshuffle::utils::{
        random,
        map::MapUtilsImpl
    };
    use darkshuffle::constants::{DEFAULT_NS};
    use achievement::store::{Store, StoreTrait};
    use darkshuffle::utils::tasks::index::{Task, TaskTrait};

    #[abi(embed_v0)]
    impl MapContractImpl of super::IMapContract<ContractState> {
        fn generate_tree(ref self: ContractState, game_id: u128) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            game.assert_owner(world);
            game.assert_generate_tree();

            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);

            game.map_level += 1;
            game.map_depth = 1;
            game.last_node_id = 0;
            game.action_count += 1;

            world.write_model(@Map {
                game_id,
                level: game.map_level,
                seed,
            });

            world.write_model(@game);
            world.emit_event(@GameActionEvent {game_id, tx_hash: starknet::get_tx_info().unbox().transaction_hash, count: game.action_count});

            // [Achievement] Complete a map
            if game.season_id != 0 && game.map_level > 1 {
                let player_id: felt252 = starknet::get_caller_address().into();
                let task_id: felt252 = Task::Explorer.identifier();
                let time = starknet::get_block_timestamp();
                let store = StoreTrait::new(world);
                store.progress(player_id, task_id, count: 1, time: time);
            }
        }

        fn select_node(ref self: ContractState, game_id: u128, node_id: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            game.assert_owner(world);
            game.assert_select_node();

            let mut map: Map = world.read_model((game_id, game.map_level));
            assert(MapUtilsImpl::node_available(game, map, node_id), 'Invalid node');

            game.last_node_id = node_id;

            let monster_node: MonsterNode = MapUtilsImpl::get_monster_node(map, node_id);
            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);

            MapUtilsImpl::start_battle(ref world, ref game, monster_node, seed);

            game.action_count += 1;

            world.write_model(@game);
            world.emit_event(@GameActionEvent {game_id, tx_hash: starknet::get_tx_info().unbox().transaction_hash, count: game.action_count});
        }
    }
}
