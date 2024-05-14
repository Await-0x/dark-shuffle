use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{ContractAddress, get_caller_address};
use darkshuffle::models::game::Game;

#[derive(Model, Copy, Drop, Serde)]
struct Battle {
    #[key]
    battle_id: usize,
    game_id: usize,
    round: u16,
    deck_iteration: u16,
    card_index: u16,
    hero_health: u16,
    hero_energy: u16,
    monster_id: u16,
    monster_attack: u16,
    monster_health: u16
}

#[derive(Model, Copy, Drop, Serde)]
struct Creature {
    #[key]
    battle_id: usize,
    #[key]
    creature_id: u16,
    card_id: u16,
    cost: u16,
    attack: u16,
    health: u16,
    shield: bool,
    resting_round: u16,
}

#[derive(Model, Copy, Drop, Serde)]
struct Board {   
    #[key]
    battle_id: usize,
    creature1: u16,
    creature2: u16,
    creature3: u16,
    creature4: u16,
    creature5: u16,
    creature6: u16,
}

#[derive(Model, Copy, Drop, Serde)]
struct HandCard {   
    #[key]
    battle_id: usize,
    #[key]
    hand_card_number: u8,
    card_id: u16
}

#[derive(Model, Copy, Drop, Serde)]
struct BattleEffects {   
    #[key]
    battle_id: usize,
    cards_discarded: u16,
    creatures_played: u16,
    spells_played: u16,
    demons_played: u16,
    next_spell_reduction: u16,
    dead_creatures: u16
}

#[derive(Model, Copy, Drop, Serde)]
struct RoundEffects {   
    #[key]
    battle_id: usize,
    creatures_played: u16,
}

#[derive(Copy, Drop)]
struct Monster {
    monster_id: u16,
    attack: u16,
    health: u16
}

#[derive(Copy, Drop)]
struct Card {
    card_id: u16,
    name: felt252,
    card_type: felt252,
    card_tag: felt252,
    cost: u16,
    attack: u16,
    health: u16,
}

#[generate_trait]
impl BattleOwnerImpl of BattleOwnerTrait { 
    fn assert_battle(self: Battle, world: IWorldDispatcher) {
        let game: Game = get!(world, self.game_id, Game);
        assert(game.player == get_caller_address(), 'Not Owner');
        assert(self.hero_health > 0, 'Battle over');
        assert(self.monster_health > 0, 'Battle over');
    }

    fn assert_energy(self: Battle, cost: u16) {
        assert(self.hero_energy >= cost, 'Not enough energy');
    }

    fn assert_hand_card(self: HandCard) {
        assert(self.card_id != 0, 'Card already played');
    }

    fn assert_creature(self: Creature) {
        assert(self.card_id != 0, 'Creature not found');
        assert(self.health > 0, 'Creature dead');
    }
}