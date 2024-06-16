#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Draft {
    #[key]
    game_id: usize,
    card_count: u8,
    entropy_count: u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct DraftOption {
    #[key]
    game_id: usize,
    #[key]
    option_id: u8,
    card_id: u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct DraftCard {
    #[key]
    game_id: usize,
    #[key]
    number: u8,
    card_id: u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct DraftEntropy {
    #[key]
    game_id: usize,
    #[key]
    number: u16,
    block_number: u64,
    block_hash: felt252
}