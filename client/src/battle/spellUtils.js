import { ADVENTURER_ID } from "../helpers/constants"

export const spellEffect = ({ spell, board, healAdventurer, deckIteration, target,
  damageMonster, setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
  roundEffects, setRoundEffects, battleEffects, setBattleEffects, hand }) => {

  if (spell.cardId === 18) {
    damageMonster(deckIteration + 2)
  }

  if (spell.cardId === 19) {
    healAdventurer(deckIteration + 2)
  }

  if (spell.cardId === 20) {
    healAdventurer(8)
  }

  if (spell.cardId === 21) {
    damageMonster(10)
  }

  if (spell.cardId === 22) {
    let health = target.health
    target.health = target.attack
    target.attack = health
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