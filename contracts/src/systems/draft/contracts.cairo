#[starknet::interface]
trait IDraftContract<T> {
    fn pick_card(ref self: T, game_id: usize, option_id: u8);
}

#[dojo::contract]
mod draft_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::draft::{Draft, DraftOwnerTrait};
    use darkshuffle::utils::{
        random,
        draft::DraftUtilsImpl
    };
    use darkshuffle::constants::{DRAFT_SIZE, DEFAULT_NS};

    #[abi(embed_v0)]
    impl DraftContractImpl of super::IDraftContract<ContractState> {
        fn pick_card(ref self: ContractState, game_id: usize, option_id: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game = world.read_model(game_id);
            game.assert_draft();

            let mut draft: Draft = world.read_model(game_id);
            draft.assert_option(option_id);

            draft.add_card(option_id);

            if draft.cards.len() == DRAFT_SIZE.into() {
                game.in_draft = false;
                world.write_model(@game);
            } else {
                let random_hash = random::get_random_hash();
                let seed: u128 = random::get_entropy(random_hash);
                draft.options = DraftUtilsImpl::get_draft_options(seed); 
            }

            world.write_model(@draft);
        }
    }
}
