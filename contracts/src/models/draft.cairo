#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Draft {
    #[key]
    game_id: usize,
    options: Span<u8>,
    cards: Span<u8>,
}

#[generate_trait]
impl DraftOwnerImpl of DraftOwnerTrait {
    fn assert_option(self: Draft, option_id: u8) {
        assert(*self.options.at(0) == option_id || *self.options.at(1) == option_id || *self.options.at(2) == option_id, 'Invalid Option');
    }

    fn add_card(ref self: Draft, card_id: u8) {
        let mut new_cards = array![];

        let mut i = 0;
        while i < self.cards.len() {
            new_cards.append(*self.cards.at(i));
            i += 1;
        };

        new_cards.append(card_id);
        self.cards = new_cards.span();
    }
}
