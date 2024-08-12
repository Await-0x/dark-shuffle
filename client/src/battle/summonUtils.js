import { tags } from "../helpers/cards";

export const summonEffect = ({
  creature,
  shieldHero,
  target,
  setBoard,
  monster,
  damageMonster,
  battleEffects,
  setBattleEffects
}) => {
  const { level, cardId } = creature;

  let updatedBattleEffects = {}

  if (monster.id === 4) {
    creature.resting = true
  }

  if (cardId === 1) {
    shieldHero(level)
  }

  else if (cardId === 2) {
    shieldHero(1 + level)
  }

  else if (cardId === 3) {
    shieldHero(1 + level)
  }

  else if (cardId === 4) {
    setBoard(prev => prev.map(_creature => ({ ..._creature, health: _creature.health + level })))
  }

  else if (cardId === 5) {
    creature.attack += level;
  }

  else if (cardId === 6) {
    creature.attack += level;
    creature.health += level;
  }

  else if (cardId === 7) {
    damageMonster(3 + level);
  }

  else if (cardId === 8) {
    damageMonster(level);
  }

  else if (cardId === 9) {
    updatedBattleEffects.nextSpellReduction = level;
  }

  else if (cardId === 13) {
    shieldHero(1);
  }

  else if (cardId === 14) {
    shieldHero(2);
  }

  else if (cardId === 15) {
    shieldHero(3);
  }

  else if (cardId === 16 && target) {
    target.shield = true
  }

  else if (cardId === 21) {
    shieldHero(5);
  }

  else if (cardId === 22) {
    shieldHero(5);
  }

  else if (cardId === 23) {
    shieldHero(5);
  }

  else if (cardId === 24 && target) {
    target.attack += 6;
  }

  else if (cardId === 26) {
    damageMonster(12);
  }

  else if (cardId === 28) {
    damageMonster(8);
  }

  else if (cardId === 29) {
    updatedBattleEffects.freeDiscard = true;
  }

  if (creature.tag === tags.UNSTABLE) {
    updatedBattleEffects.unstablesPlayed = [...battleEffects.unstablesPlayed, creature.id];
  }

  setBattleEffects(prev => ({ ...prev, ...updatedBattleEffects }))
}