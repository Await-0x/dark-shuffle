import { tags } from "../helpers/cards";

export const summonEffect = ({
  creature,
  shieldHero,
  target,
  setBoard,
  monster,
  damageMonster,
  branch,
  setBattleEffects,
  setRoundEnergy
}) => {
  const { level, cardId } = creature;

  let updatedBattleEffects = {};

  if (creature.tag == tags.FATIQUE) {
    setRoundEnergy(prev => Math.max(0, prev - 1));
  }

  if (monster.id === 4) {
    creature.resting = true;
  }

  if (cardId === 1) {
    shieldHero(3 + level);
  }

  else if (cardId === 2) {
    shieldHero(6 + level);
  }

  else if (cardId === 3) {
    shieldHero(level);
  }

  else if (cardId === 4) {
    setBoard(prev => prev.map(_creature => ({ ..._creature, health: _creature.health + (level * 2) })));
  }

  else if (cardId === 5) {
    creature.attack += level;
  }

  else if (cardId === 6) {
    creature.attack += (2 * level);
    creature.health += (2 * level);
  }

  else if (cardId === 7) {
    damageMonster(10 + (3 * level), 'Creature');
  }

  else if (cardId === 8) {
    damageMonster(4 + (2 * level), 'Creature');
  }

  else if (cardId === 9) {
    updatedBattleEffects.nextSpellReduction = level;
  }

  else if (cardId === 13) {
    shieldHero(2);
  }

  else if (cardId === 14) {
    shieldHero(2);
  }

  else if (cardId === 15) {
    shieldHero(3);
  }

  else if (cardId === 16 && target) {
    target.shield = true;
  }

  else if (cardId === 21) {
    shieldHero(3);
  }

  else if (cardId === 22) {
    shieldHero(3);
  }

  else if (cardId === 23) {
    shieldHero(3);
  }

  else if (cardId === 24 && target) {
    target.attack += 6;
  }

  else if (cardId === 26) {
    damageMonster(7, 'Creature');
  }

  else if (cardId === 28) {
    damageMonster(8, 'Creature');
  }

  else if (cardId === 29) {
    updatedBattleEffects.freeDiscard = true;
  }

  setBattleEffects(prev => ({ ...prev, ...updatedBattleEffects }));
}