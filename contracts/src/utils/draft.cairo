use darkshuffle::utils::random;

#[generate_trait]
impl DraftUtilsImpl of DraftUtilsTrait {
    fn get_draft_options(mut entropy: u128) -> Span<u8> {
        let mut card_1 = 0;
        let mut card_2 = 0;
        let mut card_3 = 0;

        card_1 = random::get_random_card_id(entropy);
        entropy = random::LCG(entropy, 0);
        card_2 = random::get_random_card_id(entropy);
        entropy = random::LCG(entropy, 0);
        card_3 = random::get_random_card_id(entropy);

        loop {
            if card_1 == card_2 {
                entropy = random::LCG(entropy, 0);
                card_2 = random::get_random_card_id(entropy);
                continue;
            }

            if card_1 == card_3 {
                entropy = random::LCG(entropy, 0);
                card_3 = random::get_random_card_id(entropy);
                continue;
            }

            if card_2 == card_3 {
                entropy = random::LCG(entropy, 0);
                card_3 = random::get_random_card_id(entropy);
                continue;
            }

            break;
        };

        array![card_1, card_2, card_3].span()
    }
}