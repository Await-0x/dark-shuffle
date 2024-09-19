#[dojo::interface]
trait IDraftContract {
    fn get_draft_options(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252);
    fn pick_card(ref world: IWorldDispatcher, game_id: usize, option_id: u8);
}

#[dojo::contract]
mod draft_systems {
    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::draft::{Draft, DraftOption, DraftCard};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::utils::{
        random,
        draft::draft_utils
    };
    use darkshuffle::constants::{Messages, DRAFT_SIZE};

    #[abi(embed_v0)]
    impl DraftContractImpl of super::IDraftContract<ContractState> {
        fn get_draft_options(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252) {
            let mut game = get!(world, (game_id), Game);
            game.assert_draft();

            let mut entropy: Entropy = get!(world, (game_id, game.entropy_count), Entropy);
            entropy.block_hash = entropy_hash;
            
            let seed: u128 = random::get_entropy(entropy_hash);
            let (option_1, option_2, option_3) = draft_utils::get_draft_options(game_id, seed); 

            game.entropy_count += 1;

            let mut next_block = get_block_info().unbox().block_number.into() + 1;

            if next_block <= entropy.block_number {
                next_block = entropy.block_number + 1;
            }

            set!(world, (
                option_1,
                option_2,
                option_3,
                Entropy { game_id, number: game.entropy_count, block_number: next_block, block_hash: 0 },
                entropy,
                game
            ));
        }

        fn pick_card(ref world: IWorldDispatcher, game_id: usize, option_id: u8) {
            let mut game = get!(world, (game_id), Game);
            game.assert_draft();

            let mut draft = get!(world, (game_id), Draft);

            let mut choice = get!(world, (game_id, option_id), DraftOption);
            
            draft.card_count += 1;

            set!(world, (
                draft,
                DraftCard { game_id, card_id: choice.card_id, number: draft.card_count, level: choice.level }
            ));

            if draft.card_count == DRAFT_SIZE {
                game.in_draft = false;
            } 
            
            set!(world, (game));
        }
    }
}
