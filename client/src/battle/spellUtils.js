import { ADVENTURER_ID } from "../helpers/constants"

export const spellEffect = ({ spell, board, shieldHero, deckIteration, target,
  damageMonster, setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
  gameEffects, setGameEffects, hand, creatureDead }) => {

  if (spell.cardId === 18) {
    damageMonster(deckIteration + 3)
  }

  if (spell.cardId === 19) {
    shieldHero(deckIteration + 3)
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

  let updatedGameEffects = {
    ...gameEffects,
    spellsPlayed: gameEffects.spellsPlayed + 1,
    nextSpellReduction: 0
  }

  setGameEffects(updatedGameEffects)
}