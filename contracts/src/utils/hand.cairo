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
}
