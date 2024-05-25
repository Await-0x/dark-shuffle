mod summon_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card, BattleEffects, RoundEffects};
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
        let mut battle_effects: BattleEffects = get!(world, (battle.battle_id), BattleEffects);
        let mut round_effects: RoundEffects = get!(world, (battle.battle_id), RoundEffects);

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

        if battle.monster_id == 404 {
            creature.resting_round = battle.round;
        }

        if card.card_id == 1 {
            creature.attack += battle.deck_iteration;
            creature.health += battle.deck_iteration;
        }

        else if card.card_id == 2 {
            battle.hero_health += battle.deck_iteration;
        }
        
        else if card.card_id == 3 {
            let mut amount = 0;
            if battle.deck_iteration > 3 {
                amount = 0;
            } else {
                amount = 4 - battle.deck_iteration;
            }

            battle_utils::damage_hero(ref battle, amount);
        }
        
        else if card.card_id == 4 {
            battle_utils::damage_monster(ref battle, battle.deck_iteration);
        }

        else if card.card_id == 5 && target.card_id != 0 {
            target.shield = true;
            set!(world, (target));
        }

        else if card.card_id == 6 {
            creature.attack += battle_effects.demons_played;
        }

        else if card.card_id == 7 && target.card_id != 0 {
            target.attack += battle.deck_iteration;
        }

        else if card.card_id == 8 {
            battle.hero_energy += 3;
        }
        
        else if card.card_id == 9 {
            battle.hero_energy += battle.deck_iteration;
        }
        
        else if card.card_id == 10 {
            creature.attack += battle_effects.cards_discarded;
        }
        
        else if card.card_id == 11 {
            let count: u16 = board_utils::count_board(world, battle.battle_id);
            battle_utils::damage_monster(ref battle, count);
        }

        else if card.card_id == 12 {
            battle.hero_health += battle.deck_iteration + 3;
        }

        else if card.card_id == 13 {
            creature.attack += round_effects.creatures_played * battle.deck_iteration;
        }
        
        else if card.card_id == 14 {
            battle_effects.next_spell_reduction = battle.deck_iteration;
        }

        else if card.card_id == 15 {
            board_utils::update_creatures(world, battle.battle_id, 0, battle.deck_iteration);
        }

        else if card.card_id == 16 {
            let spell_count = hand_utils::count_spells(world, battle.battle_id);
            creature.attack += spell_count;
            creature.health += spell_count;
        }
        
        else if card.card_id == 17 {
            board_utils::update_creatures(world, battle.battle_id, battle.deck_iteration, 0);
        }

        if card.card_tag == CardTags::DEMON {
            battle_effects.demons_played += 1;
        }

        battle_effects.creatures_played += 1;
        round_effects.creatures_played += 1;
        
        set!(world, (creature, battle_effects, round_effects, target));
    }
}