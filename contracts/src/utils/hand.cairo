use darkshuffle::models::battle::{Battle};
use darkshuffle::constants::{MAX_HAND_SIZE};

#[generate_trait]
impl HandUtilsImpl of HandUtilsTrait {           
    fn get_starting_hand(deck: Span<u8>, amount: u8) -> Span<u8> {
        let mut hand = array![];

        let mut i = 0;
        while (i < amount.into()) {
            hand.append(*deck.at(i));
            i += 1;
        };

        hand.span()
    }

    fn remove_hand_card(ref battle: Battle, card_id: u8) {
        let mut card_removed = false;
        let mut new_hand = array![];

        let mut i = 0;
        while i < battle.hand.len() {
            if *battle.hand.at(i) == card_id && !card_removed {
                card_removed = true;
            } else {
                new_hand.append(*battle.hand.at(i));
            }

            i += 1;
        };

        battle.hand = new_hand.span();
    }

    fn draw_cards(ref battle: Battle, shuffled_deck: Span<u8>, amount: u8, skip: u8) {
        let mut new_hand = array![];

        let mut i = 0;
        while i < battle.hand.len() {
            new_hand.append(*battle.hand.at(i));
            i += 1;
        };

        i = 0;
        while i < amount.into() {
            if new_hand.len() >= MAX_HAND_SIZE.into() || skip.into() + i >= shuffled_deck.len() {
                break;
            }

            new_hand.append(*shuffled_deck.at(skip.into() + i));
            battle.deck_index += 1;
            i += 1;
        };

        battle.hand = new_hand.span();
    }
}
