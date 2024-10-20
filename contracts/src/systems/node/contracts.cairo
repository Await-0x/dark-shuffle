#[dojo::interface]
trait INodeContract {
    fn generate_tree(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252);
    fn select_node(ref world: IWorldDispatcher, node_id: usize, deck: Span<u8>);
    fn skip_node(ref world: IWorldDispatcher, node_id: usize);
}

#[dojo::contract]
mod node_systems {
    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::node::{Node, MonsterNode, PotionNode, CardNode};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::utils::{
        random,
        node::node_utils,
        game::game_utils,
    };
    use darkshuffle::constants::{Messages, DECK_SIZE};

    #[abi(embed_v0)]
    impl NodeContractImpl of super::INodeContract<ContractState> {
        fn generate_tree(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252) {
            let mut game = get!(world, (game_id), Game);
            game.assert_generate_tree();

            assert(entropy_hash != '0x0', 'Invalid entropy hash');
            let mut entropy: Entropy = get!(world, (game_id, game.entropy_count), Entropy);
            entropy.block_hash = entropy_hash;
            
            let seed: u128 = random::get_entropy(entropy_hash);

            game.branch += 1;
            game.node_level = 1;

            node_utils::generate_tree_nodes(world, game_id, seed, game.branch);
            set!(world, (game, entropy));
        }

        fn select_node(ref world: IWorldDispatcher, node_id: usize, deck: Span<u8>) {
            let mut node = get!(world, (node_id), Node);
            let mut game = get!(world, (node.game_id), Game);
            game.assert_select_node(node);

            assert(node_utils::node_available(world, node), 'Not available');

            if node.node_type == 1 {
                assert(deck.len() == DECK_SIZE.into(), 'Deck Malformed');
                let monster_node = get!(world, (node_id), MonsterNode);
                node_utils::start_battle(world, ref game, monster_node, deck);
            } else if node.node_type == 2 || node.node_type == 3 {
                let potion_node = get!(world, (node_id), PotionNode);
                node_utils::take_potion(ref game, ref node, potion_node, world);
            } else if node.node_type == 4 {
                let card_node = get!(world, (node_id), CardNode);
                node_utils::take_card(ref game, ref node, card_node, world);
            }

            set!(world, (game, node));
        }

        fn skip_node(ref world: IWorldDispatcher, node_id: usize) {
            let mut node = get!(world, (node_id), Node);
            let mut game = get!(world, (node.game_id), Game);
            game.assert_select_node(node);

            assert(node.skippable, 'Not skippable');
            assert(node_utils::node_available(world, node), 'Not available');

            node.status = 2;
            game.hero_xp += 10;
            game_utils::complete_node(ref game, world);

            set!(world, (game, node));
        }
    }
}
