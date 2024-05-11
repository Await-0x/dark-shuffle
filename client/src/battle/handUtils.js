import { tags, types } from "../helpers/cards"

export const updateCreatureCost = ({ hand, setHand, cost }) => {
  if (cost < 1 || !hand.find(card => card.type === types.CREATURE)) return;

  setHand(prev => prev.map(card => {
    if (card.type === types.CREATURE) {
      return { ...card, cost: Math.max(0, card.cost - cost) }
    }

    return card
  }))
}

export const updateSpellCost = ({ hand, setHand, cost }) => {
  if (cost < 1 || !hand.find(card => card.type === types.SPELL)) return;

  setHand(prev => prev.map(card => {
    if (card.type === types.SPELL) {
      return { ...card, cost: Math.max(0, card.cost - cost) }
    }

    return card
  }))
}

export const updateCardIdCost = ({ hand, setHand, cardId, cost }) => {
  if (cost < 1 || !hand.find(card => card.cardId === cardId)) return;

  setHand(prev => prev.map(card => {
    if (card.cardId === cardId) {
      return { ...card, cost: Math.max(0, card.cost - cost) }
    }

    return card
  }))
}

export const getCreatureCost = ({ creature, monster }) => {
  let cost = creature.cost;

  if (monster.id === 405) {
    cost += 1;
  }

  return Math.max(1, cost)
}

export const getSpellCost = ({ spell }) => {
  return Math.max(0, cost);
}