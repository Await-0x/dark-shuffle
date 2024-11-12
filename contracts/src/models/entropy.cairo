#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Entropy {
    #[key]
    game_id: usize,
    #[key]
    number: u16,
    block_number: u64,
    block_hash: felt252
}