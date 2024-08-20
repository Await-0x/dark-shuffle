mod hand_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{HandCard};
    use darkshuffle::models::draft::{DraftCard};
    use darkshuffle::constants::{DECK_SIZE};

    fn count_cards(world: IWorldDispatcher, battle_id: usize) -> u16 {
        let mut count = 0;
        
        let mut i = 1;
        while (i <= DECK_SIZE) {
            let hand_card = get!(world, (battle_id, i), HandCard);

            if hand_card.card_id != 0 {
                count += 1;
            }

            i += 1;
        };

        count
    }

    fn draw_cards(world: IWorldDispatcher, battle_id: usize, game_id: usize, deck: Span<u8>) {
        let mut i = 0;

        while (i < DECK_SIZE.into()) {
            let card_number: u8 = *deck.at(i);
            let draft_card = get!(world, (game_id, card_number), DraftCard);

            set!(world, (
                HandCard {battle_id, hand_card_number: card_number, card_id: draft_card.card_id, level: draft_card.level}
            ));

            i += 1;
        };
    }
}