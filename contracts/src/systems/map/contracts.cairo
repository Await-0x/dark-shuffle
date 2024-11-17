#[starknet::interface]
trait IMapContract<T> {
    fn generate_tree(ref self: T, game_id: usize);
    fn select_node(ref self: T, game_id: usize, node_id: u8);
}

#[dojo::contract]
mod map_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::map::{Map, MonsterNode};
    use darkshuffle::utils::{
        random,
        map::MapUtilsImpl
    };
    use darkshuffle::constants::{DEFAULT_NS};

    #[abi(embed_v0)]
    impl MapContractImpl of super::IMapContract<ContractState> {
        fn generate_tree(ref self: ContractState, game_id: usize) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            game.assert_generate_tree();

            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);

            game.map_level += 1;
            game.map_depth = 1;
            game.last_node_id = 0;

            world.write_model(@Map {
                game_id,
                level: game.map_level,
                seed,
            });

            world.write_model(@game);
        }

        fn select_node(ref self: ContractState, game_id: usize, node_id: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            let mut map: Map = world.read_model((game_id, game.map_level));
            assert(MapUtilsImpl::node_available(game, map, node_id), 'Invalid node');

            game.last_node_id = node_id;

            let monster_node: MonsterNode = MapUtilsImpl::get_monster_node(map, node_id);
            let random_hash = random::get_random_hash();
            let seed: u128 = random::get_entropy(random_hash);

            MapUtilsImpl::start_battle(ref world, ref game, monster_node, seed);
        }
    }
}
