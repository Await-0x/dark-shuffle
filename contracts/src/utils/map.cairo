use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use darkshuffle::models::battle::{Battle, BattleEffects};
use darkshuffle::models::game::{Game};
use darkshuffle::models::draft::{Draft};
use darkshuffle::models::map::{Map, MonsterNode};
use darkshuffle::utils::random;
use darkshuffle::utils::hand::HandUtilsImpl;
use darkshuffle::utils::cards::CardUtilsImpl;
use darkshuffle::constants::{STARTING_HAND_SIZE};

#[generate_trait]
impl MapUtilsImpl of MapUtilsTrait {
    fn node_available(game: Game, map: Map, node_id: u8) -> bool {
        if game.map_depth == 1 && node_id == 1 {
            return true;
        }

        let mut seed = random::LCG(map.seed, 0);
        let sections = random::get_random_number(seed, 3);

        let mut is_available = false;
        let mut current_node_id = 1;

        let mut section_index = 0;
        while section_index < sections {
            // Depth 2
            current_node_id += 1;
            if current_node_id == node_id && game.last_node_id == 1 {
                is_available = true;
                break;
            }

            // Depth 3
            current_node_id += 1;
            if current_node_id == node_id && game.last_node_id == current_node_id - 1 {
                is_available = true;
                break;
            }

            seed = random::LCG(seed, 0);
            if random::get_random_number(seed, 2) > 1 {
                current_node_id += 1;
                if current_node_id == node_id && game.last_node_id == current_node_id - 2 {
                    is_available = true;
                    break;
                }
            }

            // Depth 4
            seed = random::LCG(seed, 0);
            if random::get_random_number(seed, 2) > 1 {
                current_node_id += 1;
                if current_node_id == node_id && game.last_node_id == current_node_id - 2 {
                    is_available = true;
                    break;
                }

                current_node_id += 1;
                if current_node_id == node_id && game.last_node_id == current_node_id - 2 {
                    is_available = true;
                    break;
                }
            } else {
                current_node_id += 1;
                if current_node_id == node_id && (game.last_node_id == current_node_id - 1 || game.last_node_id == current_node_id - 2) {
                    is_available = true;
                    break;
                }
            }

            section_index += 1;
        };

        current_node_id += 1;

        if is_available || (current_node_id == node_id && game.map_depth == 5) {
            true
        } else {
            false
        }
    }

    fn get_monster_node(map: Map, node_id: u8) -> MonsterNode {
        let seed = random::LCG(map.seed, node_id);

        let mut monster_range = 0;
        if map.level > 4 {
            monster_range = 0;
        } else {
            monster_range = 75 - (15 * map.level);
        }

        let monster_id = random::get_random_number(seed, 75 - monster_range);
        let card = CardUtilsImpl::get_card(monster_id);

        let health = 35 + (map.level * 5);
        let attack = (map.level * 2);

        MonsterNode {
            monster_id,
            attack,
            health,
            monster_type: card.creature_type
        }
    }

    fn start_battle(ref world: WorldStorage, ref game: Game, monster: MonsterNode, seed: u128) {
        let battle_id = world.dispatcher.uuid();
        let draft: Draft = world.read_model(game.game_id);

        game.in_battle = true;
        game.active_battle_id = battle_id;

        let shuffled_deck = random::shuffle_deck(seed, draft.cards, 0);
        let hand = HandUtilsImpl::get_starting_hand(shuffled_deck, STARTING_HAND_SIZE);
            
        world.write_model(@Battle {
            battle_id: battle_id,
            game_id: game.game_id,

            round: 1,
            hero_health: game.hero_health,
            hero_energy: 1,
            
            monster_id: monster.monster_id,
            monster_attack: monster.attack,
            monster_health: monster.health,
            monster_type: monster.monster_type,

            hand: hand,
            deck: shuffled_deck,
            deck_index: STARTING_HAND_SIZE,
        });

        world.write_model(@BattleEffects {
            battle_id: battle_id,
            enemy_marks: 0,
            hero_dmg_reduction: 0,
            next_hunter_attack_bonus: 0,
            next_hunter_health_bonus: 0,
            next_brute_attack_bonus: 0,
            next_brute_health_bonus: 0,
        });
    }
}