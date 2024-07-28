mod summon_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card, Battleffects};
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
        card: Card,
    ) {
        let mut target: Creature = get!(world, (battle.battle_id, target_id), Creature);
        let mut battle_effects: Battleffects = get!(world, (battle.battle_id), Battleffects);

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
            creature.attack += card.level;
            creature.health += card.level;
        }

        if card.card_id == 1 {
            battle.hero_armor += card.level;
        }

        else if card.card_id == 2 {
            battle.hero_armor += 1 + card.level;
        }
        
        else if card.card_id == 3 {
            battle.hero_armor += 1 + card.level;
        }
        
        else if card.card_id == 4 {
            board_utils::update_creatures(world, battle.battle_id, 0, card.level);
        }

        else if card.card_id == 5 {
            creature.attack += card.level;
        }

        else if card.card_id == 6 {
            creature.attack += card.level;
            creature.health += card.level;
        }

        else if card.card_id == 7 {
            battle_utils::damage_monster(ref battle, 3 + card.level);
        }

        else if card.card_id == 8 {
            battle_utils::damage_monster(ref battle, card.level);
        }

        else if card.card_id == 9 {
            battle_effects.next_spell_reduction = card.level;
        }

        else if card.card_id == 13 {
            battle.hero_armor += 1;
        }

        else if card.card_id == 14 {
            battle.hero_armor += 2;
        }

        else if card.card_id == 15 {
            battle.hero_armor += 3;
        }

        else if card.card_id == 16 && target.card_id != 0 {
            target.shield = true;
        }

        else if card.card_id == 21 {
            battle.hero_armor += 3;
        }

        else if card.card_id == 22 {
            battle.hero_armor += 6;
        }

        else if card.card_id == 23 {
            battle.hero_armor += 7;
        }

        else if card.card_id == 24 {
            target.attack += 6;
        }

        else if card.card_id == 26 {
            battle_utils::damage_monster(ref battle, 12);
        }

        else if card.card_id == 28 {
            battle_utils::damage_monster(ref battle, 8);
        }

        else if card.card_id == 29 {
            battle_effects.free_discard = true;
        }
        
        set!(world, (creature, battle_effects, target));
    }
}