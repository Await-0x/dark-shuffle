#[dojo::interface]
trait IGameContract {
    fn start_game(ref world: IWorldDispatcher, name: felt252);
}

#[dojo::contract]
mod game_systems {
    use starknet::{get_caller_address, get_block_info};

    use darkshuffle::constants::{DECK_SIZE, START_ENERGY, START_HEALTH, LAST_NODE_LEVEL};
    use darkshuffle::models::game::{Game};
    use darkshuffle::models::draft::{Draft};
    use darkshuffle::models::entropy::{Entropy};

    #[abi(embed_v0)]
    impl GameContractImpl of super::IGameContract<ContractState> {
        fn start_game(ref world: IWorldDispatcher, name: felt252) {
            let game_id = world.uuid();

            set!(world, (
                Game {
                    game_id,
                    player: get_caller_address(),
                    player_name: name,
                    active: true,
                    in_draft: true,
                    in_battle: false,
                    active_battle_id: 0,

                    hero_health: START_HEALTH,
                    hero_energy: START_ENERGY,
                    hero_xp: 1,

                    branch: 0,
                    node_level: LAST_NODE_LEVEL,
                    monsters_slain: 0,
                    entropy_count: 1
                },
                Draft {
                    game_id,
                    card_count: 0
                },
                Entropy {
                    game_id,
                    number: 1,
                    block_number: get_block_info().unbox().block_number.into() + 1,
                    block_hash: 0
                }
            ));
        }
    }
}