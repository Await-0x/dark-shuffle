#[dojo::interface]
trait IDraftContract {
    fn get_draft_options(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252);
    fn pick_card(ref world: IWorldDispatcher, game_id: usize, option_id: u8);
}

#[dojo::contract]
mod draft_systems {
    use starknet::{get_caller_address, get_block_info};
    use darkshuffle::models::game::{Game, GameOwnerTrait};
    use darkshuffle::models::draft::{Draft, DraftOption, DraftCard, DraftEntropy};
    use darkshuffle::utils::{
        random,
        draft::draft_utils
    };
    use darkshuffle::constants::{Messages, DECK_SIZE};

    #[abi(embed_v0)]
    impl DraftContractImpl of super::IDraftContract<ContractState> {
        fn get_draft_options(ref world: IWorldDispatcher, game_id: usize, entropy_hash: felt252) {
            let mut game = get!(world, (game_id), Game);
            game.assert_draft();

            let mut draft = get!(world, (game_id), Draft);
            let mut draft_entropy: DraftEntropy = get!(world, (game_id, draft.entropy_count), DraftEntropy);
            draft_entropy.block_hash = entropy_hash;
            
            let entropy: u128 = random::get_entropy(entropy_hash);
            let (option_1, option_2, option_3) = draft_utils::get_draft_options(game_id, entropy); 

            set!(world, (option_1, option_2, option_3, draft_entropy));
        }

        fn pick_card(ref world: IWorldDispatcher, game_id: usize, option_id: u8) {
            let mut game = get!(world, (game_id), Game);
            game.assert_draft();

            let mut draft = get!(world, (game_id), Draft);
            let mut draft_entropy: DraftEntropy = get!(world, (game_id, draft.entropy_count), DraftEntropy);
            
            let mut next_block = get_block_info().unbox().block_number.into();
            if next_block <= draft_entropy.block_number {
                next_block = draft_entropy.block_number + 1;
            }

            let mut choice = get!(world, (game_id, option_id), DraftOption);
            
            draft.card_count += 1;
            draft.entropy_count += 1;

            set!(world, (
                draft,
                DraftCard { game_id, card_id: choice.card_id, number: draft.card_count }
            ));

            if draft.card_count == DECK_SIZE {
                game.in_draft = false;
                set!(world, (game));
            } else {
                set!(world, (
                    DraftEntropy { game_id, number: draft.entropy_count, block_number: next_block, block_hash: 0 }
                ));
            }
        }
    }
}
