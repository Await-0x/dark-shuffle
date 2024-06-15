mod game_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use starknet::syscalls::get_block_hash_syscall;
    use starknet::SyscallResultTrait;

    use darkshuffle::constants::{DECK_SIZE, MONSTER_KILL_SCORE};
    use darkshuffle::models::game::{Game, Leaderboard};
    use darkshuffle::models::battle::{Battle, Monster};
    use darkshuffle::models::draft::{DraftEntropy};

    use darkshuffle::utils::{monsters::monster_utils};

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
        game.battles_won += 1;
        game.in_battle = false;
        game.active_battle_id = 0;
        game.hero_health = battle.hero_health;
        game.deck_iteration = battle.deck_iteration;

        set!(world, (game, battle));
    }
    
    fn battle_lost(ref battle: Battle, world: IWorldDispatcher) {
        let mut game: Game = get!(world, (battle.game_id), Game);
        game.in_battle = false;
        game.active = false;
        game.active_battle_id = 0;
        game.hero_health = 0;
        game.deck_iteration = battle.deck_iteration;

        update_leaderboard(ref game, ref battle, world);
        set!(world, (game, battle));
    }

    fn verify_draft(game_id: usize, world: IWorldDispatcher) {
        let mut i = 1;

        while (i <= DECK_SIZE) {
            let draft_entropy = get!(world, (game_id, i), DraftEntropy);

            assert(draft_entropy.block_hash == get_block_hash_syscall(draft_entropy.block_number).unwrap_syscall(), 'Entropy failed');

            i += 1;
        };
    }

    fn update_leaderboard(ref game: Game, ref battle: Battle, world: IWorldDispatcher) {
        // verify_draft(game.game_id, world);
        
        let score = score_game(ref game, ref battle);

        set!(world, (
            Leaderboard {
                game_id: game.game_id,
                player: starknet::get_caller_address(),
                player_name: game.player_name,
                score
            }
        ))
    }

    fn score_game(ref game: Game, ref battle: Battle) -> u16 {
        let mut score: u16 = 0;

        score += MONSTER_KILL_SCORE * game.battles_won;

        let monster: Monster = monster_utils::get_monster(game.battles_won);
        if battle.monster_health < monster.health {
            score += monster.health - battle.monster_health;
        }

        score
    }
}