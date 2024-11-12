#[starknet::interface]
trait IDraftContract<T> {
    fn get_draft_options(ref self: T, game_id: usize, entropy_hash: felt252);
    fn pick_card(ref self: T, game_id: usize, option_id: u8);
}

#[dojo::contract]
mod draft_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::draft::{Draft, DraftOption, DraftCard};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::utils::{
        random,
        draft::DraftUtilsImpl
    };
    use darkshuffle::constants::{DRAFT_SIZE, DEFAULT_NS};

    #[abi(embed_v0)]
    impl DraftContractImpl of super::IDraftContract<ContractState> {
        fn get_draft_options(ref self: ContractState, game_id: usize, entropy_hash: felt252) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game = world.read_model(game_id);
            game.assert_draft();

            assert(entropy_hash != '0x0', 'Invalid entropy hash');
            let mut entropy: Entropy = world.read_model((game_id, game.entropy_count));
            entropy.block_hash = entropy_hash;
            
            let seed: u128 = random::get_entropy(entropy_hash);
            let (option_1, option_2, option_3) = DraftUtilsImpl::get_draft_options(game_id, seed); 

            game.entropy_count += 1;

            let mut next_block = get_block_info().unbox().block_number.into();

            if next_block <= entropy.block_number {
                next_block = entropy.block_number + 1;
            }

            world.write_model(@option_1);
            world.write_model(@option_2);
            world.write_model(@option_3);
            world.write_model(@Entropy { game_id, number: game.entropy_count, block_number: next_block, block_hash: 0 });
            world.write_model(@entropy);
            world.write_model(@game);
        }

        fn pick_card(ref self: ContractState, game_id: usize, option_id: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game = world.read_model(game_id);
            game.assert_draft();

            let mut draft: Draft = world.read_model(game_id);

            let mut choice: DraftOption = world.read_model((game_id, option_id));
            
            draft.card_count += 1;

            world.write_model(@draft);
            world.write_model(@DraftCard { game_id, card_id: choice.card_id, number: draft.card_count, level: choice.level });

            if draft.card_count == DRAFT_SIZE {
                game.in_draft = false;
            } 

            world.write_model(@game);
        }
    }
}
