use starknet::ContractAddress;

#[starknet::interface]
trait IConfigContract<T> {
    fn create_game_settings(
        ref self: T, 
        start_health: u8,
        start_energy: u8,
        start_hand_size: u8,
        draft_size: u8,
        max_health: u8,
        max_energy: u8,
        max_hand_size: u8,
    );

    fn set_game_token_address(ref self: T, game_token_address: ContractAddress);
    fn get_game_token_address(self: @T) -> ContractAddress;
}

#[dojo::contract]
mod config_systems {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use starknet::{ContractAddress, get_caller_address};
    use darkshuffle::models::config::{GameSettings, WorldConfig};
    use darkshuffle::constants::{DEFAULT_NS, WORLD_CONFIG_ID};

    #[abi(embed_v0)]
    impl ConfigContractImpl of super::IConfigContract<ContractState> {
        fn create_game_settings(
            ref self: ContractState, 
            start_health: u8,
            start_energy: u8,
            start_hand_size: u8,
            draft_size: u8,
            max_health: u8,
            max_energy: u8,
            max_hand_size: u8,
        ) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());
            
            assert(start_health > 0, 'Invalid start health');
            assert(max_health > 0, 'Invalid max health');
            assert(draft_size > 0, 'Invalid draft size');
            assert(max_energy > 0, 'Invalid max energy');
            assert(max_hand_size > 0, 'Invalid max hand size');

            world.write_model(@GameSettings {
                settings_id: world.dispatcher.uuid() + 1,
                start_health,
                start_energy,
                start_hand_size,
                draft_size,
                max_health,
                max_energy,
                max_hand_size,
            });
        }

        fn set_game_token_address(ref self: ContractState, game_token_address: ContractAddress) {
            let mut world: WorldStorage = self.world(DEFAULT_NS());
            assert(
                world.dispatcher.is_owner(selector_from_tag!("darkshuffle-game_systems"), get_caller_address()),
                'Not Owner'
            );

            let mut world_config: WorldConfig = world.read_model(WORLD_CONFIG_ID);
            world_config.game_token_address = game_token_address;
            world.write_model(@world_config);
        }

        fn get_game_token_address(self: @ContractState) -> ContractAddress {
            let world: WorldStorage = self.world(DEFAULT_NS());
            let world_config: WorldConfig = world.read_model(WORLD_CONFIG_ID);
            world_config.game_token_address
        }
    }
}