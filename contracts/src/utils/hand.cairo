use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use darkshuffle::models::battle::{HandCard};
use darkshuffle::models::draft::{DraftCard};
use darkshuffle::constants::{DECK_SIZE};

#[generate_trait]
impl HandUtilsImpl of HandUtilsTrait {           
    fn count_cards(world: WorldStorage, battle_id: usize) -> u16 {
        let mut count = 0;
        
        let mut i = 1;
        while (i <= DECK_SIZE) {
            let hand_card: HandCard = world.read_model((battle_id, i));

            if hand_card.card_id != 0 {
                count += 1;
            }

            i += 1;
        };

        count
    }

    fn draw_cards(ref world: WorldStorage, battle_id: usize, game_id: usize, deck: Span<u8>) {
        let mut i = 0;

        while (i < DECK_SIZE.into()) {
            let card_number: u8 = *deck.at(i);
            let draft_card: DraftCard = world.read_model((game_id, card_number));

            world.write_model(@HandCard {battle_id, hand_card_number: card_number, card_id: draft_card.card_id, level: draft_card.level});

            i += 1;
        };
    }
}