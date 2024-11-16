use darkshuffle::models::battle::{CreatureType};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Map {
    #[key]
    game_id: usize,
    #[key]
    level: u8,
    seed: u128
}

#[derive(Copy, Drop, Serde)]
pub struct MonsterNode {
    monster_id: u8,
    attack: u8,
    health: u8,
    monster_type: CreatureType
}
