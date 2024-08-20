mod draft_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use darkshuffle::models::draft::{DraftOption, DraftCard};
    use darkshuffle::utils::random;
    use darkshuffle::constants::{MAX_CARD_LEVEL, DECK_SIZE};

    fn get_draft_options(game_id: usize, mut entropy: u128) -> (DraftOption, DraftOption, DraftOption) {
        let mut card_1 = 0;
        let mut card_2 = 0;
        let mut card_3 = 0;

        card_1 = random::get_random_card_id(entropy);
        entropy = random::LCG(entropy);
        card_2 = random::get_random_card_id(entropy);
        entropy = random::LCG(entropy);
        card_3 = random::get_random_card_id(entropy);

        loop {
            if card_1 == card_2 {
                entropy = random::LCG(entropy);
                card_2 = random::get_random_card_id(entropy);
                continue;
            }

            if card_1 == card_3 {
                entropy = random::LCG(entropy);
                card_3 = random::get_random_card_id(entropy);
                continue;
            }

            if card_2 == card_3 {
                entropy = random::LCG(entropy);
                card_3 = random::get_random_card_id(entropy);
                continue;
            }

            break;
        };

        (
            DraftOption {game_id, option_id: 1, card_id: card_1, level: 1},
            DraftOption {game_id, option_id: 2, card_id: card_2, level: 1},
            DraftOption {game_id, option_id: 3, card_id: card_3, level: 1}
        )
    }

    fn level_up_cards(world: IWorldDispatcher, game_id: usize, deck: Span<u8>) {
        let mut i = 0;

        while (i < DECK_SIZE.into()) {
            let card_number: u8 = *deck.at(i);
            let mut draft_card = get!(world, (game_id, card_number), DraftCard);

            if draft_card.level < MAX_CARD_LEVEL {
                draft_card.level += 1;
                set!(world, (draft_card));
            }

            i += 1;
        };
    }
}