#[starknet::interface]
trait INodeContract<T> {
    fn generate_tree(ref self: T, game_id: usize, entropy_hash: felt252);
    fn select_node(ref self: T, node_id: usize, deck: Span<u8>);
    fn skip_node(ref self: T, node_id: usize);
}

#[dojo::contract]
mod node_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::node::{Node, MonsterNode, PotionNode, CardNode};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::utils::{
        random,
        node::NodeUtilsImpl,
        game::GameUtilsImpl,
    };
    use darkshuffle::constants::{Messages, DECK_SIZE, DEFAULT_NS};

    #[abi(embed_v0)]
    impl NodeContractImpl of super::INodeContract<ContractState> {
        fn generate_tree(ref self: ContractState, game_id: usize, entropy_hash: felt252) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            game.assert_generate_tree();

            assert(entropy_hash != '0x0', 'Invalid entropy hash');
            let mut entropy: Entropy = world.read_model((game_id, game.entropy_count));
            entropy.block_hash = entropy_hash;
            
            let seed: u128 = random::get_entropy(entropy_hash);

            game.branch += 1;
            game.node_level = 1;

            NodeUtilsImpl::generate_tree_nodes(ref world, game_id, seed, game.branch);

            world.write_model(@game);
            world.write_model(@entropy);
        }

        fn select_node(ref self: ContractState, node_id: usize, deck: Span<u8>) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut node: Node = world.read_model(node_id);
            let mut game: Game = world.read_model(node.game_id);
            game.assert_select_node(node);

            assert(NodeUtilsImpl::node_available(world, node), 'Not available');

            if node.node_type == 1 {
                assert(deck.len() == DECK_SIZE.into(), 'Deck Malformed');
                let monster_node: MonsterNode = world.read_model(node_id);
                NodeUtilsImpl::start_battle(ref world, ref game, monster_node, deck);
            } else if node.node_type == 2 || node.node_type == 3 {
                let potion_node: PotionNode = world.read_model(node_id);
                NodeUtilsImpl::take_potion(ref game, ref node, potion_node);
            } else if node.node_type == 4 {
                let card_node: CardNode = world.read_model(node_id);
                NodeUtilsImpl::take_card(ref world, ref game, ref node, card_node);
            }

            world.write_model(@game);
            world.write_model(@node);
        }

        fn skip_node(ref self: ContractState, node_id: usize) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut node: Node = world.read_model(node_id);
            let mut game: Game = world.read_model(node.game_id);
            game.assert_select_node(node);

            assert(node.skippable, 'Not skippable');
            assert(NodeUtilsImpl::node_available(world, node), 'Not available');

            node.status = 2;
            game.hero_xp += 10;
            GameUtilsImpl::complete_node(ref game);

            world.write_model(@game);
            world.write_model(@node);
        }
    }
}
