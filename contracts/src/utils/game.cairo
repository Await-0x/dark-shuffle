use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{get_caller_address, get_block_info, get_tx_info};
use starknet::syscalls::get_block_hash_syscall;
use starknet::SyscallResultTrait;

use darkshuffle::constants::{DECK_SIZE, MONSTER_KILL_SCORE, BRANCH_SCORE_MULTIPLIER, START_ENERGY, LAST_NODE_LEVEL, MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID};
use darkshuffle::models::game::{Game};
use darkshuffle::models::battle::{Battle};
use darkshuffle::models::entropy::{Entropy};
use darkshuffle::models::node::{Node};
use darkshuffle::models::season::{Season, SeasonOwnerTrait};

use darkshuffle::utils::{
    monsters::MonsterUtilsImpl,
    draft::DraftUtilsImpl,
    season::SeasonUtilsImpl
};

#[generate_trait]
impl GameUtilsImpl of GameUtilsTrait {
    fn is_battle_over(battle: Battle) -> bool {
        if battle.monster_health > 0 && battle.hero_health > 0 {
            return false;
        }

        true
    }

    fn end_battle(ref world: WorldStorage, ref battle: Battle) {
        if battle.hero_health == 0 {
            Self::battle_lost(ref world, ref battle);
        } else if battle.monster_health == 0 {
            Self::battle_won(ref world, ref battle);
        }
    }

    fn battle_won(ref world: WorldStorage, ref battle: Battle) {
        let mut game: Game = world.read_model((battle.game_id));
        let mut node: Node = world.read_model((battle.node_id));

        game.monsters_slain += 1;
        game.in_battle = false;
        game.active_battle_id = 0;

        game.hero_health = battle.hero_health;
        game.hero_energy = START_ENERGY;
        game.hero_xp += (MONSTER_KILL_SCORE + BRANCH_SCORE_MULTIPLIER * node.branch).into();

        node.status = 1;
        Self::complete_node(ref game);

        DraftUtilsImpl::level_up_cards(ref world, game.game_id, battle.deck);

        world.write_model(@game);
        world.write_model(@battle);
        world.write_model(@node);
    }
    
    fn battle_lost(ref world: WorldStorage, ref battle: Battle) {
        let mut game: Game = world.read_model((battle.game_id));

        game.in_battle = false;
        game.active = false;
        game.active_battle_id = 0;
        game.hero_health = 0;

        Self::verify_game(ref world, ref game);
        world.write_model(@game);
        world.write_model(@battle);
    }

    fn verify_game(ref world: WorldStorage, ref game: Game) {
        let chain_id = get_tx_info().unbox().chain_id;

        if chain_id == MAINNET_CHAIN_ID || chain_id == SEPOLIA_CHAIN_ID {
            let season: Season = world.read_model((game.season_id));
            season.assert_season();
        }

        let mut i = 1;
        let mut verified = true;

        let mut current_block = get_block_info().unbox().block_number.into();
        let mut last_entropy: Entropy = world.read_model((game.game_id, game.entropy_count));

        if last_entropy.block_number > current_block - 10 {
            return;
        }

        while (i <= game.entropy_count) {
            let mut draft_entropy: Entropy = world.read_model((game.game_id, i));

            if draft_entropy.block_hash == '0x0' {
                break;
            }

            if draft_entropy.block_hash != get_block_hash_syscall(draft_entropy.block_number).unwrap_syscall() {
                verified = false;
                break;
            }

            i += 1;
        };

        if verified {
            game.entropy_verified = true;
            SeasonUtilsImpl::score_game(ref world, game);
        }
    }

    fn complete_node(ref game: Game) {
        game.node_level += 1;
    }
}