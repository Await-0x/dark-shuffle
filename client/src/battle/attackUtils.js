import { tags } from "../helpers/cards";

export const attackEffect = ({
  creature, values, board, setBattleEffects, reduceMonsterAttack, healHero,
}) => {
  let updatedBattleEffects = {};

  let magicalCount = board.filter(creature => creature.creatureType === tags.MAGICAL).length
  let bruteCount = board.filter(creature => creature.creatureType === tags.BRUTE).length
  let hunterCount = board.filter(creature => creature.creatureType === tags.HUNTER).length

  let extraDamage = 0;

  if (creature.cardId === 2) {
    if (values.monsterType === tags.BRUTE) {
      healHero(2);
    }
    creature.health += magicalCount;
  }

  else if (creature.cardId === 5) {
    if (magicalCount >= 2) {
      extraDamage += 2;
    }
  }

  else if (creature.cardId === 6) {
    if (values.monsterType === tags.MAGICAL) {
      extraDamage += 5;
    }
  }

  else if (creature.cardId === 8) {
    creature.attack += hunterCount;
  }

  else if (creature.cardId === 13) {
    if (values.monsterType === tags.HUNTER) {
      extraDamage += 2;
    }
    if (bruteCount > 1) {
      creature.attack += 1;
    }
  }

  else if (creature.cardId === 20) {
    if (values.monsterType === tags.BRUTE) {
      reduceMonsterAttack(1);
    }
  }

  else if (creature.cardId === 21) {
    if (values.monsterType === tags.MAGICAL) {
      extraDamage += 1;
    }
    if (creature.health > values.monsterAttack) {
      creature.health += 1;
    }
  }

  else if (creature.cardId === 23) {
    if (hunterCount > 1) {
      creature.attack += 1;
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 28) {
    if (values.monsterType === tags.HUNTER) {
      creature.health += 2;
    }
  }

  else if (creature.cardId === 32) {
    if (magicalCount > 1) {
      extraDamage += 1;
    }
    if (creature.health > values.monsterAttack) {
      creature.health += 1;
    }
  }

  else if (creature.cardId === 35) {
    if (values.monsterType === tags.BRUTE) {
      extraDamage += 1;
    }
    if (magicalCount === 1) {
      creature.attack += 1;
    }
  }

  else if (creature.cardId === 37) {
    if (values.monsterType === tags.MAGICAL) {
      creature.attack += 1;
    }
    if (hunterCount > 0) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 40) {
    if (values.monsterType === tags.MAGICAL) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 43) {
    if (values.monsterType === tags.HUNTER) {
      creature.health += 2;
    }
  }

  else if (creature.cardId === 46) {
    if (values.monsterType === tags.BRUTE) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 50) {
    if (values.monsterType === tags.BRUTE) {
      creature.attack += 1;
    }
  }

  else if (creature.cardId === 52) {
    if (hunterCount === 1) {
      creature.health += 1;
    } else {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 55) {
    if (values.monsterType === tags.MAGICAL) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 57) {
    if (values.monsterType === tags.HUNTER) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 62) {
    if (magicalCount > 1) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 65) {
    if (values.monsterType === tags.BRUTE) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 67) {
    if (hunterCount > 1) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 69) {
    if (values.monsterType === tags.MAGICAL) {
      extraDamage += 1;
    }
  }

  else if (creature.cardId === 75) {
    if (bruteCount > 1) {
      extraDamage += 1;
    }
  }

  setBattleEffects(prev => ({ ...prev, ...updatedBattleEffects }));

  return extraDamage;
}