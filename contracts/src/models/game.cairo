use starknet::{ContractAddress, get_caller_address};
use darkshuffle::models::node::Node;
use darkshuffle::constants::{LAST_NODE_LEVEL};

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

    hero_health: u16,
    hero_energy: u16,
    hero_xp: u32,

    branch: u16,
    node_level: u8,
    monsters_slain: u16,
    entropy_count: u16,
    entropy_verified: bool
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct GameEffects {   
    #[key]
    game_id: usize,
    bonus_attack: u16
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
        assert(self.node_level == LAST_NODE_LEVEL, 'Tree Not Completed');
    }

    fn assert_select_node(self: Game, node: Node) {
        assert(self.player == get_caller_address(), 'Not Owner');
        assert(self.active, 'Game over');
        assert(!self.in_draft, 'In Draft');
        assert(!self.in_battle, 'In Battle');
        assert(node.status == 0, 'Already Selected');
        assert(self.node_level == node.level, 'Unavailable Node');
    }
}