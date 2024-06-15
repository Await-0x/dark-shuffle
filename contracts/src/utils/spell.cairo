mod spell_utils {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use darkshuffle::models::battle::{Battle, Creature, Card};
    use darkshuffle::models::game::{GameEffects};
    use darkshuffle::constants::{CardTags};
    use darkshuffle::utils::{
        battle::battle_utils,
    };

    fn cast_spell(world: IWorldDispatcher, target_id: u16, ref battle: Battle, card: Card) {
        let mut target: Creature = get!(world, (battle.battle_id, target_id), Creature);
        let mut game_effects: GameEffects = get!(world, (battle.game_id), GameEffects);

        if card.card_id == 18 {
            battle_utils::damage_monster(ref battle, battle.deck_iteration + 2);
        }
        
        if card.card_id == 19 {
            battle.hero_armor += battle.deck_iteration + 2;
        }
        
        if card.card_id == 20 {
            battle.hero_armor += 8;
        }
        
        if card.card_id == 21 {
            battle_utils::damage_monster(ref battle, 10);
        }

        if card.card_id == 22 {
            let health = target.health;
            target.health = target.attack;
            target.attack = health;
        }
        
        if card.card_id == 23 {
            target.attack += battle.deck_iteration + 1;
        }
        
        if card.card_id == 24 {
            target.shield = true;
        }
        
        game_effects.spells_played += 1;
        game_effects.next_spell_reduction = 0;

        set!(world, (game_effects, target));
    }
}