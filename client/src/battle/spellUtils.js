import { tags } from "../helpers/cards";

export const spellEffect = ({
  spell, shieldHero, target,
  damageMonster, increaseEnergy, healHero,
  battleEffects, setBattleEffects
}) => {
  const { cardId, level } = spell;

  let updatedBattleEffects = {}

  if (cardId === 10) {
    damageMonster(6 + level);
  }

  else if (cardId === 11) {
    damageMonster(12 + level);
  }

  else if (cardId === 12) {
    shieldHero(level);
  }

  else if (cardId === 30) {
    shieldHero(8);
  }

  else if (cardId === 31) {
    shieldHero(4);
  }

  else if (cardId === 32) {
    damageMonster(21);
  }

  else if (cardId === 33) {
    damageMonster(12);
  }

  else if (cardId === 34) {
    target.shield = true;
  }

  else if (cardId === 35) {
    updatedBattleEffects.nextCardReduction = 1;
  }

  else if (cardId === 36) {
    healHero(3);
  }

  else if (cardId === 37) {
    increaseEnergy(5);
  }

  else if (cardId === 38) {
    shieldHero(5);
  }

  else if (cardId === 39) {
    damageMonster(15);
  }

  else if (cardId === 40) {
    updatedBattleEffects.damageImmune = true;
  }

  if (spell.tag === tags.UNSTABLE) {
    updatedBattleEffects.unstablesPlayed = [...battleEffects.unstablesPlayed, spell.id];
  }

  setBattleEffects(prev => ({ ...prev, ...updatedBattleEffects }))
}