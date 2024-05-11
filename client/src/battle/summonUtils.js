import { afflixes, tags, types } from "../helpers/cards"
import { updateTypeStats } from "./boardUtils";

export const summonEffect = ({
  creature,
  healAdventurer,
  deckIteration,
  target,
  board,
  setBoard,
  hand,
  increaseEnergy,
  monster,
  damageAdventurer,
  damageMonster,
  roundEffects,
  setRoundEffects,
  battleEffects,
  setBattleEffects
}) => {
  if (monster.id === 404) {
    creature.resting = true
  }

  if (creature.cardId === 1) {
    creature.attack += deckIteration
    creature.health += deckIteration
  }

  else if (creature.cardId === 2) {
    healAdventurer(deckIteration)
  }

  else if (creature.cardId === 3) {
    damageAdventurer(Math.max(0, 4 - deckIteration));
  }

  else if (creature.cardId === 4) {
    damageMonster(deckIteration);
  }

  else if (creature.cardId === 5 && target) {
    target.shield = true
  }

  else if (creature.cardId === 6) {
    creature.attack += battleEffects.demonsPlayed
  }

  else if (creature.cardId === 7 && target) {
    target.attack += deckIteration
  }

  else if (creature.cardId === 8) {
    increaseEnergy(3)
  }

  else if (creature.cardId === 9) {
    increaseEnergy(deckIteration)
  }

  else if (creature.cardId === 10) {
    creature.attack += battleEffects.cardsDiscarded
    creature.health += battleEffects.cardsDiscarded
  }

  else if (creature.cardId === 11) {
    damageMonster(board.length)
  }

  else if (creature.cardId === 12) {
    healAdventurer(deckIteration + 3)
  }

  else if (creature.cardId === 13) {
    creature.attack += roundEffects.creaturesPlayed
  }

  else if (creature.cardId === 14) {
    battleEffects.nextSpellReduction = deckIteration
  }

  else if (creature.cardId === 15) {
    setBoard(prev => prev.map(creature => ({ ...creature, health: creature.health + deckIteration })))
  }

  else if (creature.cardId === 16) {
    let spellCount = hand.filter(card => card.type === types.SPELL).length
    creature.attack += spellCount
    creature.health += spellCount
  }

  else if (creature.cardId === 17) {
    setBoard(prev => prev.map(creature => ({ ...creature, attack: creature.attack + deckIteration })))
  }

  let updatedBattleEffects = {
    ...battleEffects,
    creaturesPlayed: battleEffects.creaturesPlayed + 1,
    demonsPlayed: creature.tag === tags.DEMON ? battleEffects.demonsPlayed + 1 : battleEffects.demonsPlayed
  }

  let updatedRoundEffects = {
    ...roundEffects,
    creaturesPlayed: roundEffects.creaturesPlayed + 1
  }

  setBattleEffects(updatedBattleEffects)
  setRoundEffects(updatedRoundEffects)
}