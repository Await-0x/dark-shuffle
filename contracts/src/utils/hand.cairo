mod hand_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{HandCard, Card, Battle};
    use darkshuffle::models::draft::{DraftCard};
    use darkshuffle::constants::{CardTypes, DECK_SIZE};
    use darkshuffle::utils::{
        cards::card_utils
    };

    fn count_spells(world: IWorldDispatcher, battle_id: usize) -> u16 {
        let mut count = 0;
        
        let mut i = 1;
        while (i <= DECK_SIZE) {
            let hand_card = get!(world, (battle_id, i), HandCard);

            if hand_card.card_id != 0 {
                let card: Card = card_utils::get_card(hand_card.card_id);
                if card.card_type == CardTypes::SPELL {
                    count += 1;
                }
            }
        };

        count
    }

    fn count_cards(world: IWorldDispatcher, battle_id: usize) -> u16 {
        let mut count = 0;
        
        let mut i = 1;
        while (i <= DECK_SIZE) {
            let hand_card = get!(world, (battle_id, i), HandCard);

            if hand_card.card_id != 0 {
                count += 1;
            }
        };

        count
    }

    fn draw_cards(world: IWorldDispatcher, battle_id: usize) {
        let mut i = 1;

        while (i <= DECK_SIZE) {
            let draft_card = get!(world, (battle_id, i), DraftCard);

            set!(world, (
                HandCard {battle_id, hand_card_number: i, card_id: draft_card.card_id}
            ));
        };
    }
}