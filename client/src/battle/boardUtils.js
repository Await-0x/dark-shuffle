import { MAX_BOARD } from "../helpers/constants";

export const updateCreatureStats = ({ board, setBoard, cardId, attack, health }) => {
  if (!board.find(creature => creature.cardId === cardId)) return;

  setBoard(prev => prev.map(creature => {
    if (creature.cardId === cardId) {
      creature.attack += attack;
      creature.health += health;
    }

    return creature
  }))
}

export const addCreatureAttribute = ({ board, setBoard, cardId, attribute }) => {
  if (!board.find(creature => creature.cardId === cardId)) return;

  setBoard(prev => prev.map(creature => {
    if (creature.cardId === cardId) return { ...creature, ...attribute }
    return creature
  }))
}

export const updateTypeStats = ({ board, setBoard, type, attack, health }) => {
  if (!board.find(creature => creature.tag === type)) return;

  setBoard(prev => prev.map(creature => {
    if (creature.tag === type) {
      creature.attack += attack;
      creature.health += health;
    }

    return creature
  }))
}

export const getAvailableBoardId = (board) => {
  const ids = new Set(board.map(creature => creature.id));

  for (let i = 1; i <= MAX_BOARD; i++) {
    if (!ids.has(i)) {
      return i;
    }
  }
}