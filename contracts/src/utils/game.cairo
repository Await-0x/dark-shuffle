mod game_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use starknet::{get_caller_address, get_block_info};
    use starknet::syscalls::get_block_hash_syscall;
    use starknet::SyscallResultTrait;

    use darkshuffle::constants::{DECK_SIZE, MONSTER_KILL_SCORE, BRANCH_SCORE_MULTIPLIER, START_ENERGY, LAST_NODE_LEVEL};
    use darkshuffle::models::game::{Game, Leaderboard};
    use darkshuffle::models::battle::{Battle, Monster};
    use darkshuffle::models::entropy::{Entropy};
    use darkshuffle::models::node::{Node};

    use darkshuffle::utils::{
        monsters::monster_utils,
        draft::draft_utils
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

        draft_utils::level_up_cards(world, game.game_id);

        set!(world, (game, battle, node));
    }
    
    fn battle_lost(ref battle: Battle, world: IWorldDispatcher) {
        let mut game: Game = get!(world, (battle.game_id), Game);

        game.in_battle = false;
        game.active = false;
        game.active_battle_id = 0;
        game.hero_health = 0;

        update_leaderboard(ref game, ref battle, world);
        set!(world, (game, battle));
    }

    fn verify_draft(game_id: usize, world: IWorldDispatcher) {
        let mut i = 1;

        while (i <= DECK_SIZE) {
            let draft_entropy = get!(world, (game_id, i), Entropy);

            assert(draft_entropy.block_hash == get_block_hash_syscall(draft_entropy.block_number).unwrap_syscall(), 'Entropy failed');

            i += 1;
        };
    }

    fn update_leaderboard(ref game: Game, ref battle: Battle, world: IWorldDispatcher) {
        // verify_draft(game.game_id, world);
        
        set!(world, (
            Leaderboard {
                game_id: game.game_id,
                player: starknet::get_caller_address(),
                player_name: game.player_name,
                score: game.hero_xp
            }
        ))
    }

    fn complete_node(ref game: Game, world: IWorldDispatcher) {
        game.node_level += 1;

        if game.node_level == LAST_NODE_LEVEL {
            let mut next_block = get_block_info().unbox().block_number.into() + 1;
            game.entropy_count += 1;
            set!(world, (Entropy { game_id: game.game_id, number: game.entropy_count, block_number: next_block, block_hash: 0 }));
        }
    }
}