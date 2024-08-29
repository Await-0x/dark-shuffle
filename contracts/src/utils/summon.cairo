mod summon_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects};
    use darkshuffle::constants::{CardTags};
    use darkshuffle::utils::{
        battle::battle_utils,
        board::board_utils,
        hand::hand_utils
    };

    fn summon_creature(
        creature_id: u16,
        target_id: u16,
        world: IWorldDispatcher,
        ref battle: Battle,
        ref battle_effects: BattleEffects,
        card: Card,
    ) {
        let mut target: Creature = get!(world, (battle.battle_id, target_id), Creature);
        if target.creature_id > 0 {
            assert(target.health > 0, 'Creature is dead');
        }

        let mut creature: Creature = Creature {
            battle_id: battle.battle_id,
            creature_id,
            card_id: card.card_id,
            cost: card.cost,
            attack: card.attack,
            health: card.health,
            shield: false,
            resting_round: 0,
        };

        if battle.monster_id == 4 {
            creature.resting_round = battle.round;
        }

        if card.card_tag == CardTags::SCALABLE {
            creature.attack += (card.level * card.tag_multiplier.into());
            creature.health += (card.level * card.tag_multiplier.into());
        }

        if card.card_tag == CardTags::FATIQUE {
            if battle.round_energy > 0 {
                battle.round_energy -= 1;
            }
        }

        if card.card_id == 1 {
            battle_utils::increase_armor(ref battle, 3 + card.level, ref battle_effects);
        }

        else if card.card_id == 2 {
            battle_utils::increase_armor(ref battle, 6 + card.level, ref battle_effects);
        }
        
        else if card.card_id == 3 {
            battle_utils::increase_armor(ref battle, card.level, ref battle_effects);
        }
        
        else if card.card_id == 4 {
            board_utils::update_creatures(world, battle.battle_id, 0, (2 * card.level));
        }

        else if card.card_id == 5 {
            creature.attack += card.level;
        }

        else if card.card_id == 6 {
            creature.attack += (2 * card.level);
            creature.health += (2 * card.level);
        }

        else if card.card_id == 7 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 10 + (card.level * 3), 2);
        }

        else if card.card_id == 8 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 4 + (card.level * 2), 2);
        }

        else if card.card_id == 9 {
            battle_effects.next_spell_reduction = card.level;
        }

        else if card.card_id == 13 {
            battle_utils::increase_armor(ref battle, 2, ref battle_effects);
        }

        else if card.card_id == 14 {
            battle_utils::increase_armor(ref battle, 2, ref battle_effects);
        }

        else if card.card_id == 15 {
            battle_utils::increase_armor(ref battle, 3, ref battle_effects);
        }

        else if card.card_id == 16 && target.card_id != 0 {
            target.shield = true;
        }

        else if card.card_id == 21 {
            battle_utils::increase_armor(ref battle, 3, ref battle_effects);
        }

        else if card.card_id == 22 {
            battle_utils::increase_armor(ref battle, 3, ref battle_effects);
        }

        else if card.card_id == 23 {
            battle_utils::increase_armor(ref battle, 3, ref battle_effects);
        }

        else if card.card_id == 24 {
            target.attack += 6;
        }

        else if card.card_id == 26 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 7, 2);
        }

        else if card.card_id == 28 {
            battle_utils::damage_monster(ref battle, ref battle_effects, 8, 2);
        }

        else if card.card_id == 29 {
            battle_effects.free_discard = true;
        }
        
        set!(world, (creature, battle_effects, target));
    }
}