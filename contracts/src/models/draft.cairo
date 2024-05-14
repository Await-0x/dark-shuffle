#[derive(Model, Copy, Drop, Serde)]
struct Draft {
    #[key]
    game_id: usize,
    card_count: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct DraftOption {
    #[key]
    game_id: usize,
    #[key]
    option_id: u8,
    card_id: u16,
}

#[derive(Model, Copy, Drop, Serde)]
struct DraftCard {
    #[key]
    game_id: usize,
    #[key]
    number: u8,
    card_id: u16,
}

#[derive(Model, Copy, Drop, Serde)]
struct DraftEntropy {
    #[key]
    game_id: usize,
    #[key]
    number: u8,
    block_number: u64,
    block_hash: felt252
}