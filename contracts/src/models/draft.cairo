#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Draft {
    #[key]
    game_id: usize,
    card_count: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct DraftOption {
    #[key]
    game_id: usize,
    #[key]
    option_id: u8,
    card_id: u16,
    level: u16
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct DraftCard {
    #[key]
    game_id: usize,
    #[key]
    number: u8,
    card_id: u16,
    level: u16
}