use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{get_caller_address, get_block_info, get_block_timestamp, get_tx_info, get_contract_address};
use core::{array::ArrayTrait};

use darkshuffle::models::battle::{Battle, BattleEffects};
use darkshuffle::models::game::{Game};
use darkshuffle::models::entropy::{Entropy};
use darkshuffle::models::draft::{Draft, DraftCard};
use darkshuffle::models::node::{Node, MonsterNode, PotionNode, CardNode};
use darkshuffle::utils::random;
use darkshuffle::utils::hand::HandUtilsImpl;
use darkshuffle::utils::game::GameUtilsImpl;
use darkshuffle::constants::{MONSTER_COUNT, U128_MAX, LCG_PRIME, LAST_NODE_LEVEL, START_ENERGY, MAX_CARD_LEVEL};

#[generate_trait]
impl NodeUtilsImpl of NodeUtilsTrait {
    fn node_available(world: WorldStorage, node: Node) -> bool {
        if node.parents.is_empty() {
            return true;
        }

        let mut available = false;
        let mut index = 0;

        loop {
            if available || index.into() == node.parents.len() {
                break;
            } 
        
            let mut parent_node: Node = world.read_model((*node.parents.at(index)));
            available = parent_node.status != 0;

            index += 1;
        };

        available
    }

    fn generate_tree_nodes(ref world: WorldStorage, game_id: usize, mut seed: u128, branch: u16) {
        let mut node_type: u16 = Self::random_node(seed);
        let mut grand_parent_id = Self::save_node(ref world, game_id, node_type, branch, seed, array![].span(), 1);

        seed = random::LCG(seed);
        let sections = random::get_random_number(seed, 3);
        let mut section_index = 0;
        let mut last_node_parents: Array<usize> = array![];

        loop {
            if section_index == sections {
                break;
            }

            seed = random::LCG(seed);
            node_type = Self::random_node(seed);

            let mut parent_id = Self::save_node(ref world, game_id, node_type, branch, seed, array![grand_parent_id].span(), 2);

            seed = random::LCG(seed);
            node_type = Self::random_node(seed);

            let mut parent_id_1 = Self::save_node(ref world, game_id, node_type, branch, seed, array![parent_id].span(), 3);
            let mut parent_id_2 = 0;

            seed = random::LCG(seed);
            if random::get_random_number(seed, 2) > 1 {
                seed = random::LCG(seed);
                node_type = Self::random_node(seed);
                parent_id_2 = Self::save_node(ref world, game_id, node_type, branch, seed, array![parent_id].span(), 3);
            }

            seed = random::LCG(seed);
            node_type = Self::random_node(seed);

            if random::get_random_number(seed, 2) > 1 {
                parent_id_1 = Self::save_node(ref world, game_id, node_type, branch, seed, array![parent_id_1].span(), 4);
                seed = random::LCG(seed);
                node_type = Self::random_node(seed);
                parent_id_2 = Self::save_node(ref world, game_id, node_type, branch, seed, array![parent_id_2].span(), 4);
                last_node_parents.append(parent_id_1);
                last_node_parents.append(parent_id_2);
            } else {
                parent_id_1 = Self::save_node(ref world, game_id, node_type, branch, seed, array![parent_id_1, parent_id_2].span(), 4);
                last_node_parents.append(parent_id_1);
            }

            section_index += 1;
        };

        seed = random::LCG(seed);
        Self::save_node(ref world, game_id, 1, branch, seed, last_node_parents.span(), 5);
    }

    fn random_node(mut seed: u128) -> u16 {
        let mut node_type: u16 = random::get_random_number(seed, 10);

        if node_type > 9 {
            node_type = 4;
        } else if node_type > 6 {
            seed = random::LCG(seed);
            node_type = random::get_random_number(seed, 2) + 1;
        } else {
            node_type = 1;
        }

        node_type
    }

    fn save_node(ref world: WorldStorage, game_id: usize, node_type: u16, branch: u16, seed: u128, parents: Span<usize>, level: u8) -> usize {
        let node_id = world.dispatcher.uuid();
        let mut skippable = false;

        if node_type == 1 {
            world.write_model(@Self::get_monster_node(node_id, branch, seed));
        }

        else if node_type == 2 || node_type == 3 {
            world.write_model(@Self::get_potion_node(node_id, branch, seed, node_type));
            skippable = true;
        }

        else if node_type == 4 {
            world.write_model(@Self::get_card_node(node_id, branch, seed));
            skippable = true;
        }

        world.write_model(@Node {node_id, game_id, branch, node_type, skippable, status: 0, level, parents});

        return node_id;
    }

    fn get_monster_node(node_id: usize, branch: u16, mut seed: u128) -> MonsterNode {
        let monster_id = random::get_random_number(seed, MONSTER_COUNT);

        seed = random::LCG(seed);
        let health_multiplier = random::get_random_number(seed, 15);

        seed = random::LCG(seed);
        let attack_multiplier = random::get_random_number(seed, 5);

        let health = 45 + (branch * health_multiplier) + (branch * 5);
        let attack = 2 + (branch * attack_multiplier) + branch;

        MonsterNode {
            node_id,
            monster_id,
            attack,
            health
        }
    }

    fn get_potion_node(node_id: usize, branch: u16, mut seed: u128, node_type: u16) -> PotionNode {
        let mut amount = 1;

        seed = random::LCG(seed);

        if node_type == 2 {
            amount += branch + random::get_random_number(seed, branch * 2);
        } else if node_type == 3 {
            amount += random::get_random_number(seed, 4);
        }

        PotionNode {
            node_id,
            amount
        }
    }

    fn get_card_node(node_id: usize, branch: u16, mut seed: u128) -> CardNode {
        seed = random::LCG(seed);
        let card_id = random::get_random_card_id(seed);
        seed = random::LCG(seed);
        let mut card_level = random::get_random_number(seed, branch * 4);

        if card_level >= MAX_CARD_LEVEL {
            card_level = MAX_CARD_LEVEL;
        }

        CardNode {
            node_id,
            card_id,
            card_level
        }
    }

    fn start_battle(ref world: WorldStorage, ref game: Game, monster: MonsterNode, deck: Span<u8>) {
        let battle_id = world.dispatcher.uuid();

        game.in_battle = true;
        game.active_battle_id = battle_id;
        
        HandUtilsImpl::draw_cards(ref world, battle_id, game.game_id, deck);

        let mut round_energy = START_ENERGY;
        if monster.monster_id == 12 {
            round_energy -= 1;
        }

        let mut start_energy = game.hero_energy;
        if monster.monster_id == 13 {
            if game.branch > start_energy {
                start_energy = 0;
            } else {
                start_energy -= game.branch;
            }
        }

        world.write_model(@Battle {
            battle_id: battle_id,
            game_id: game.game_id,
            node_id: monster.node_id,
            round: 1,
            card_index: 1,
            round_energy: START_ENERGY,
        
            hero_health: game.hero_health,
            hero_energy: start_energy,
            hero_armor: 0,
            hero_burn: 0,
            
            monster_id: monster.monster_id,
            monster_attack: monster.attack,
            monster_health: monster.health,
            branch: game.branch,
            deck,
        });

        world.write_model(@BattleEffects {
            battle_id: battle_id,
            next_spell_reduction: 0,
            next_card_reduction: 0,
            free_discard: false,
            damage_immune: false
        });

        if game.node_level == LAST_NODE_LEVEL - 1 {
            let mut next_block = get_block_info().unbox().block_number.into() + 1;
            game.entropy_count += 1;
            world.write_model(@Entropy { game_id: game.game_id, number: game.entropy_count, block_number: next_block, block_hash: 0 });
        }
    }

    fn take_potion(ref game: Game, ref node: Node, potion: PotionNode) {
        if node.node_type == 2 {
            game.hero_health += potion.amount;
        }

        if node.node_type == 3 {
            game.hero_energy += potion.amount;
        }

        node.status = 1;
        GameUtilsImpl::complete_node(ref game);
    }

    fn take_card(ref world: WorldStorage, ref game: Game, ref node: Node, card: CardNode) {
        let mut draft: Draft = world.read_model((game.game_id));

        draft.card_count += 1;

        world.write_model(@draft);
        world.write_model(@DraftCard { game_id: game.game_id, card_id: card.card_id, number: draft.card_count, level: card.card_level });

        node.status = 1;
        GameUtilsImpl::complete_node(ref game);
    }
}