#[starknet::interface]
trait IDraftContract<T> {
    fn pick_card(ref self: T, game_id: u128, option_id: u8);
}

#[dojo::contract]
mod draft_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::models::game::{Game, GameOwnerTrait, GameState};
    use darkshuffle::models::draft::{Draft, DraftOwnerTrait};
    use darkshuffle::models::config::{GameSettings};
    use darkshuffle::utils::{
        random,
        draft::DraftUtilsImpl,
        config::ConfigUtilsImpl
    };
    use darkshuffle::constants::{DEFAULT_NS};

    #[abi(embed_v0)]
    impl DraftContractImpl of super::IDraftContract<ContractState> {
        fn pick_card(ref self: ContractState, game_id: u128, option_id: u8) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());

            let mut game: Game = world.read_model(game_id);
            game.assert_owner(world);
            game.assert_draft();

            let mut draft: Draft = world.read_model(game_id);
            draft.add_card(*draft.options.at(option_id.into()));

            let game_settings: GameSettings = ConfigUtilsImpl::get_game_settings(world, game_id);

            if draft.cards.len() == game_settings.draft_size.into() {
                game.state = GameState::Map;
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
