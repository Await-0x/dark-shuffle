mod attack_utils {
    use darkshuffle::models::battle::{Battle, Creature};

    fn attack_damage(ref creature: Creature, ref battle: Battle) -> u16 {
        if battle.monster_id == 403 {
            return creature.attack - 1;
        }

        return creature.attack;
    }
}