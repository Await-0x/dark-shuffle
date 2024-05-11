export const components = {
  'Game': {
    gameId: null,
    player: null,
    active: Boolean(),
    inDraft: Boolean(),
    inBattle: Boolean(),
    battlesWon: Number(),
    monsterHealth: Number(),
    actionsTaken: Number(),
    actionsVerified: Number()
  },

  'Action': {
    gameId: null,
    number: Number(),
    blockNumber: Number(),
    blockHash: String()
  },

  'Leaderboard': {
    rank: Number(),
    gameId: null,
    battlesWon: Number(),
    monsterHealth: Number(),
  },

  'Draft': {
    gameId: null,
    cardCount: Number(),
  },

  'DraftOption': {
    gameId: null,
    optionId: Number(),
    cardId: Number(),
  },

  'DraftCard': {
    gameId: null,
    number: Number(),
    cardId: Number(),
  }
}