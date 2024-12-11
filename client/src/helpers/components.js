export const translateName = (selector) => {
  switch (selector) {
    case '0x1a3b9b6c5802b83d9a8a21a24d6472b1a47b0529b4b6c805f26f744c22a35a9':
      return 'Game'
    case '0x1c0e9539fbce953b02e41710151458afe69463e676129a87998ab3ad86568da':
      return 'GameEffects'
    case '0x2febb181a7f6e5196432f8079e21fb0fdacc61b9a78805402d318c49133b66e':
      return 'Draft'
    case '0x6adbb0ba14306ee0120e0aafaa59e98f44bf1b897edbfa1af89386d5ca26fe1':
      return 'Battle'
    case '0x157af533f10d2429e0324cff153cd430e0e9551aa55ee1f51cee5aedf8c2c34':
      return 'BattleEffects'
    case '0x359638a3b7e5908f2efe696ef928787916140c8bb3ce20b956a1fb37ddc0957':
      return 'Board'
    case '0x744824e25bd8d5b415e9c6ced8c275711f104d630199321aa62931e9519c61f':
      return 'Map'
    case '0xdbeecd6ebdc49d0c7692b3576e074dfa43fcd48c6b060ca8f7379b672e390e':
      return 'Leaderboard'
  }
}

export const components = {
  // Game Models
  'Game': {
    gameId: Number(),
    seasonId: Number(),
    player_name: String(),
    state: Number(),

    heroHealth: Number(),
    heroXp: Number(),
    monstersSlain: Number(),

    mapLevel: Number(),
    mapDepth: Number(),
    lastNodeId: Number(),
  },
  'GameEffects': {
    gameId: Number(),
    firstAttack: Number(),
    firstHealth: Number(),
    firstCost: Number(),
    allAttack: Number(),
    hunterAttack: Number(),
    hunterHealth: Number(),
    magicalAttack: Number(),
    magicalHealth: Number(),
    bruteAttack: Number(),
    bruteHealth: Number(),
    heroDmgReduction: Number(),
    heroCardHeal: Boolean(),
    cardDraw: Number(),
    playCreatureHeal: Number(),
    startBonusEnergy: Number(),
  },

  // Draft Models
  'Draft': {
    gameId: Number(),
    options: 'array',
    cards: 'array',
  },

  // Battle models
  'Battle': {
    battleId: Number(),
    gameId: Number(),

    round: Number(),
    hero: 'Hero',
    monster: 'Monster',

    hand: 'array',
    deck: 'array',
    deckIndex: Number(),

    battleEffects: 'BattleEffects',
  },
  'Board': {
    battleId: Number(),
    creature1: 'Creature',
    creature2: 'Creature',
    creature3: 'Creature',
    creature4: 'Creature',
    creature5: 'Creature',
    creature6: 'Creature',
  },

  // Map models
  'Map': {
    gameId: Number(),
    level: Number(),
    seed: Number(),
  },

  // Season Models
  'Leaderboard': {
    seasonId: Number(),
    rank: Number(),
    gameId: Number(),
    score: Number(),
  },
}
