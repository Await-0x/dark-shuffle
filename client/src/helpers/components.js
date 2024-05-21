export const components = {
  'Game': {
    gameId: null,
    player: null,
    player_name: String(),
    active: Boolean(),
    inDraft: Boolean(),
    inBattle: Boolean(),
    battlesWon: Number()
  },
  'Leaderboard': {
    gameId: null,
    player: null,
    player_name: String(),
    score: Number()
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
  },
  'DraftEntropy': {
    gameId: null,
    number: Number(),
    blockNumber: Number(),
    blockHash: Number()
  },
  'Battle': {
    battleId: null,
    gameId: null,
    round: Number(),
    deckIteration: Number(),
    cardIndex: Number(),
    heroHealth: Number(),
    heroEnergy: Number(),
    monsterId: Number(),
    monsterAttack: Number(),
    monsterHealth: Number()
  },
  'Creature': {
    battleId: null,
    creatureId: Number(),
    cardId: Number(),
    cost: Number(),
    attack: Number(),
    health: Number(),
    shield: Number(),
    restingRound: Number()
  },
  'Board': {
    battleId: null,
    creature1: Number(),
    creature2: Number(),
    creature3: Number(),
    creature4: Number(),
    creature5: Number(),
    creature6: Number(),
  },
  'HandCard': {
    battleId: null,
    handCardNumber: Number(),
    cardId: Number(),
  },
  'BattleEffects': {
    battleId: null,
    cardsDiscarded: Number(),
    creaturesPlayed: Number(),
    spellsPlayed: Number(),
    demonsPlayed: Number(),
    nextSpellReduction: Number(),
    deadCreatures: Number()
  },
  'RoundEffects': {
    battleId: null,
    creaturesPlayed: Number()
  }
}