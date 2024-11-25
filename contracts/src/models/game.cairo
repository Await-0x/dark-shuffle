use starknet::{ContractAddress, get_caller_address};
use darkshuffle::constants::{LAST_NODE_DEPTH};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    game_id: usize,
    season_id: usize,
    player: ContractAddress,
    player_name: felt252,
    active: bool,
    in_draft: bool,
    in_battle: bool,
    active_battle_id: usize,

    hero_health: u8,
    monsters_slain: u16,

    map_level: u8,
    map_depth: u8,
    last_node_id: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GameEffects {   
    #[key]
    game_id: usize,
    hunter_attack: u8,
    hunter_health: u8,
    magical_attack: u8,
    magical_health: u8,
    brute_attack: u8,
    brute_health: u8,
    hero_card_heal: bool,
    card_draw: u8
}

#[generate_trait]
impl GameOwnerImpl of GameOwnerTrait {
    fn assert_draft(self: Game) {
        assert(self.player == get_caller_address(), 'Not Owner');
        assert(self.active, 'Game over');
        assert(self.in_draft, 'Draft over');
    }

    fn assert_generate_tree(self: Game) {
        assert(self.player == get_caller_address(), 'Not Owner');
        assert(self.active, 'Game over');
        assert(!self.in_draft, 'In Draft');
        assert(!self.in_battle, 'In Battle');
        assert(self.map_depth == LAST_NODE_DEPTH, 'Tree Not Completed');
    }
}