mod game_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use starknet::{get_caller_address, get_block_info, get_tx_info};
    use starknet::syscalls::get_block_hash_syscall;
    use starknet::SyscallResultTrait;

    use darkshuffle::constants::{DECK_SIZE, MONSTER_KILL_SCORE, BRANCH_SCORE_MULTIPLIER, START_ENERGY, LAST_NODE_LEVEL, MAINNET_CHAIN_ID};
    use darkshuffle::models::game::{Game};
    use darkshuffle::models::battle::{Battle};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::models::node::{Node};
    use darkshuffle::models::season::{Season, SeasonOwnerTrait};

    use darkshuffle::utils::{
        monsters::monster_utils,
        draft::draft_utils,
        season::season_utils
    };

    fn is_battle_over(battle: Battle) -> bool {
        if battle.monster_health > 0 && battle.hero_health > 0 {
            return false;
        }

        true
    }

    fn end_battle(ref battle: Battle, world: IWorldDispatcher) {
        if battle.hero_health == 0 {
            battle_lost(ref battle, world);
        } else if battle.monster_health == 0 {
            battle_won(ref battle, world);
        }
    }

    fn battle_won(ref battle: Battle, world: IWorldDispatcher) {
        let mut game: Game = get!(world, (battle.game_id), Game);
        let mut node: Node = get!(world, (battle.node_id), Node);

        game.monsters_slain += 1;
        game.in_battle = false;
        game.active_battle_id = 0;

        game.hero_health = battle.hero_health;
        game.hero_energy = START_ENERGY;
        game.hero_xp += (MONSTER_KILL_SCORE + BRANCH_SCORE_MULTIPLIER * node.branch).into();

        node.status = 1;
        complete_node(ref game, world);

        draft_utils::level_up_cards(world, game.game_id, battle.deck);

        set!(world, (game, battle, node));
    }
    
    fn battle_lost(ref battle: Battle, world: IWorldDispatcher) {
        let mut game: Game = get!(world, (battle.game_id), Game);

        game.in_battle = false;
        game.active = false;
        game.active_battle_id = 0;
        game.hero_health = 0;

        verify_game(ref game, world);
        set!(world, (game, battle));
    }

    fn verify_game(ref game: Game, world: IWorldDispatcher) {
        let chain_id = get_tx_info().unbox().chain_id;

        if chain_id == MAINNET_CHAIN_ID {
            get!(world, (game.season_id), Season).assert_season();
        }

        let mut i = 1;
        let mut verified = true;

        if game.node_level == LAST_NODE_LEVEL - 1 {
            game.entropy_count -= 1;
        }

        while (i <= game.entropy_count) {
            let draft_entropy = get!(world, (game.game_id, i), Entropy);

            if draft_entropy.block_hash != get_block_hash_syscall(draft_entropy.block_number).unwrap_syscall() {
                verified = false;
                break;
            }

            i += 1;
        };

        if verified {
            game.entropy_verified = true;
            season_utils::score_game(game, world);
        }
    }

    fn complete_node(ref game: Game, world: IWorldDispatcher) {
        game.node_level += 1;
    }
}