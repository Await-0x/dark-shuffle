import { ADVENTURER_ID } from "../helpers/constants"

export const spellEffect = ({ spell, board, shieldHero, deckIteration, target,
  damageMonster, setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
  roundEffects, setRoundEffects, battleEffects, setBattleEffects, hand, creatureDead }) => {

  if (spell.cardId === 18) {
    damageMonster(deckIteration + 2)
  }

  if (spell.cardId === 19) {
    shieldHero(deckIteration + 2)
  }

  if (spell.cardId === 20) {
    shieldHero(8)
  }

  if (spell.cardId === 21) {
    damageMonster(10)
  }

  if (spell.cardId === 22) {
    let health = target.health
    target.health = target.attack
    target.attack = health
    if (target.health <= 0) {
      creatureDead(target)
    }
  }

  if (spell.cardId === 23) {
    target.attack += deckIteration + 1
  }

  if (spell.cardId === 24) {
    target.shield = true;
  }

  let updatedBattleEffects = {
    ...battleEffects,
    spellsPlayed: battleEffects.spellsPlayed + 1,
    nextSpellReduction: 0
  }

  let updatedRoundEffects = {
    ...roundEffects,
    spellsPlayed: roundEffects.spellsPlayed + 1,
    nextSpellReduction: 0
  }

  setBattleEffects(updatedBattleEffects)
  setRoundEffects(updatedRoundEffects)
}