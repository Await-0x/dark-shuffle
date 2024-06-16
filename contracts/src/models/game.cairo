use starknet::{ContractAddress, get_caller_address};
use darkshuffle::models::battle::Battle;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Game {
    #[key]
    game_id: usize,
    player: ContractAddress,
    player_name: felt252,
    active: bool,
    in_draft: bool,
    in_battle: bool,
    battles_won: u16,
    active_battle_id: usize,
    hero_health: u16,
    hero_energy: u16,
    deck_iteration: u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct GameEffects {   
    #[key]
    game_id: usize,
    cards_discarded: u16,
    creatures_played: u16,
    spells_played: u16,
    demons_played: u16,
    next_spell_reduction: u16,
    dead_creatures: u16
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Leaderboard {
    #[key]
    game_id: usize,
    player: ContractAddress,
    player_name: felt252,
    score: u16,
}

#[generate_trait]
impl GameOwnerImpl of GameOwnerTrait { 
    fn assert_draft(self: Game) {
        assert(self.player == get_caller_address(), 'Not Owner');
        assert(self.active, 'Game over');
        assert(self.in_draft, 'Draft over');
    }
}