import { tags } from "../helpers/cards";

export const spellEffect = ({
  spell, shieldHero, target,
  damageMonster, increaseEnergy, healHero,
  setRoundEnergy, setBattleEffects, pierceDamageAdventurer
}) => {
  const { cardId, level } = spell;

  let updatedBattleEffects = {}

  if (spell.tag == tags.FATIQUE) {
    setRoundEnergy(prev => Math.max(0, prev - 1))
  }

  if (cardId === 10) {
    damageMonster(level, 'Spell');
  }

  else if (cardId === 11) {
    damageMonster(3 + (3 * level), 'Spell');
  }

  else if (cardId === 12) {
    shieldHero(1 + level);
  }

  else if (cardId === 30) {
    shieldHero(4);
  }

  else if (cardId === 31) {
    shieldHero(4);
  }

  else if (cardId === 32) {
    damageMonster(13, 'Spell');
  }

  else if (cardId === 33) {
    damageMonster(11, 'Spell');
  }

  else if (cardId === 34) {
    target.shield = true;
  }

  else if (cardId === 35) {
    updatedBattleEffects.nextCardReduction = 1;
  }

  else if (cardId === 36) {
    healHero(1);
  }

  else if (cardId === 37) {
    shieldHero(6);
  }

  else if (cardId === 38) {
    damageMonster(15, 'Spell');
  }

  else if (cardId === 39) {
    pierceDamageAdventurer(5)
    updatedBattleEffects.damageImmune = true;
  }

  setBattleEffects(prev => ({ ...prev, ...updatedBattleEffects }))
}