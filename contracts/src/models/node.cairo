#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Node {
    #[key]
    node_id: usize,
    game_id: usize,
    branch: u16,
    node_type: u16,
    skippable: bool,
    status: u8,
    level: u8,
    parents: Span<usize>
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct MonsterNode {
    #[key]
    node_id: usize,
    monster_id: u16,
    attack: u16,
    health: u16
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct PotionNode {
    #[key]
    node_id: usize,
    amount: u16
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct CardNode {
    #[key]
    node_id: usize,
    card_id: u16,
    card_level: u16
}