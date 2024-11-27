use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{ContractAddress, get_caller_address};
use darkshuffle::models::game::Game;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Battle {
    #[key]
    battle_id: usize,
    game_id: usize,

    round: u8,
    hero_health: u8,
    hero_energy: u8,

    monster_id: u8,
    monster_attack: u8,
    monster_health: u8,
    monster_type: CreatureType,
    
    hand: Span<u8>,
    deck: Span<u8>,
    deck_index: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct BattleEffects {   
    #[key]
    battle_id: usize,
    enemy_marks: u8,
    hero_dmg_reduction: u8,
    next_hunter_attack_bonus: u8,
    next_hunter_health_bonus: u8,
    next_brute_attack_bonus: u8,
    next_brute_health_bonus: u8,
}

#[derive(Introspect, Copy, Drop, Serde)]
#[dojo::model]
pub struct Board {   
    #[key]
    battle_id: usize,
    creature1: Creature,
    creature2: Creature,
    creature3: Creature,
    creature4: Creature,
    creature5: Creature,
    creature6: Creature,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct Creature {
    card_id: u8,
    cost: u8,
    attack: u8,
    health: u8,
    creature_type: CreatureType,
}

#[derive(Copy, Drop, Serde)]
pub struct BoardStats {
    magical_count: u8,
    brute_count: u8,
    hunter_count: u8,
}

#[derive(Copy, Drop, Serde)]
pub struct RoundStats {
    monster_start_health: u8,
    creatures_played: u8,
    creature_attack_count: u8,
}

#[derive(Copy, Drop)]
pub struct Card {
    card_id: u8,
    name: felt252,
    card_type: CardType,
    card_tier: CardTier,
    creature_type: CreatureType,
    cost: u8,
    attack: u8,
    health: u8,
}

#[derive(PartialEq, Introspect, Copy, Drop, Serde)]
pub enum CardType {
    Creature,
    Spell,
}

#[derive(PartialEq, Introspect, Copy, Drop, Serde)]
pub enum CreatureType {
    Hunter,
    Brute,
    Magical,
    Spell,
    All,
    None
}

#[derive(Introspect, Copy, Drop, Serde)]
pub enum CardTier {
    T1,
    T2,
    T3,
    T4,
    T5,
}

#[generate_trait]
impl BattleOwnerImpl of BattleOwnerTrait { 
    fn assert_battle(self: Battle, world: WorldStorage) {
        let game: Game = world.read_model(self.game_id);
        assert(game.player == get_caller_address(), 'Not Owner');
        assert(self.hero_health > 0, 'Battle over');
        assert(self.monster_health > 0, 'Battle over');
    }

    fn card_in_hand(self: Battle, card_id: u8) -> bool {
        let mut is_in_hand = false;

        let mut i = 0;
        while i < self.hand.len() {
            if *self.hand.at(i) == card_id {
                is_in_hand = true;
                break;
            }

            i += 1;
        };

        is_in_hand
    }

    fn assert_creature(self: Creature) {
        assert(self.card_id != 0, 'Creature not found');
        assert(self.health > 0, 'Creature dead');
    }
}