import { CARD_LIST } from "../helpers/cards"

export const updatedDeckCard = (card, id) => {
  let copyOriginal = { ...CARD_LIST.find(_card => _card.cardId === card.cardId), id }

  copyOriginal.cost = card.cost
  copyOriginal.timesDiscarded = card.timesDiscarded
  copyOriginal.timesPlayed = card.timesPlayed

  return copyOriginal
}