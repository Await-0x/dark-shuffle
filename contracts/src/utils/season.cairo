mod season_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use starknet::{get_caller_address, get_block_info, ContractAddress, contract_address_const};

    use darkshuffle::constants::{PRIZES, MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID};
    use darkshuffle::models::season::{Leaderboard};
    use darkshuffle::models::game::{Game};

    fn score_game(game: Game, world: IWorldDispatcher) {
        let mut i = PRIZES;

        while i >= 0 {
            if get!(world, (game.season_id, i), Leaderboard).score > game.hero_xp {
                update_leaderboard(game, i + 1, world);
                break;
            }

            i -= 1;
        };
    }

    fn update_leaderboard(game: Game, rank: u8, world: IWorldDispatcher) {
        if rank > PRIZES {
            return;
        }

        let mut i = rank;
        let mut previous_position = get!(world, (game.season_id, rank), Leaderboard);
        set!(world, Leaderboard { season_id: game.season_id, rank, player: game.player, score: game.hero_xp });  

        while true {
            i += 1;

            if i > PRIZES || previous_position.rank == 0  {
                break;
            }
            
            let mut next_position = get!(world, (game.season_id, i), Leaderboard);
            
            previous_position.rank = i;
            set!(world, (previous_position));

            previous_position = next_position;
        };
    }

    fn get_prize_percentage(rank: u8) -> u8 {
        if rank == 1 {
            return 35;
        }

        if rank == 2 {
            return 20;
        }

        if rank == 3 {
            return 15;
        }

        if rank == 4 {
            return 10;
        }

        if rank == 5 {
            return 8;
        }

        if rank < 11 {
            return 2;
        }

        0
    }

    fn get_lords_address(chain_id: felt252) -> ContractAddress {
        if chain_id == SEPOLIA_CHAIN_ID {
            contract_address_const::<0x064fd80fcb41d00214430574a0aa19d21cc5d6452aeb4996f31b6e9ba4f466a0>()
        } else if chain_id == MAINNET_CHAIN_ID {
            contract_address_const::<0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49>()
        } else {
            panic_with_felt252('Chain not supported')
        }
    }

    fn get_developer_address(chain_id: felt252) -> ContractAddress {
        if chain_id == SEPOLIA_CHAIN_ID {
            contract_address_const::<0x0418ed348930686c844fda4556173457d3f71ae547262406d271de534af6b35e>()
        } else if chain_id == MAINNET_CHAIN_ID {
            contract_address_const::<0x02CD97240DB3f679De98A729aE91EB996cAb9Fd92a9A578Df11a72F49bE1c356>()
        } else {
            panic_with_felt252('Chain not supported')
        }
    }
}