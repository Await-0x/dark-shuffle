#[derive(Introspect, Copy, Drop, Serde)]
#[dojo::model]
pub struct Card {
    id: u64,
    created_by: ContractAddress,
    card_id: u8,
    name: felt252,
    card_type: CardType,
    card_tier: CardTier,
    creature_type: CreatureType,
    cost: u8,
    attack: u8,
    health: u8,

    play: Span<CardEffect>,
    attack: Span<CardEffect>,
    death: Span<CardEffect>,
    passive: Span<CardEffect>,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct CardEffect {
    requirement: Requirement,
    bonus_attack: u8,
    bonus_health: u8,
    hero_energy: u8,
    hero_health: u8,
    enemy_damage: u8,
    enemy_attack_reduction: u8,
    damage_reduction: u8,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct Requirement {
    enemy_type: CreatureType,
    brutes_on_board: u8,
    hunters_on_board: u8,
    magical_on_board: u8,
    hand_size: u8,
    energy: u8,
}
