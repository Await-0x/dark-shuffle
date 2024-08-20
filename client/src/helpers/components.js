export const translateName = (address) => {
  switch (address) {
    case '0x6adbb0ba14306ee0120e0aafaa59e98f44bf1b897edbfa1af89386d5ca26fe1':
      return 'Battle'
    case '0x157af533f10d2429e0324cff153cd430e0e9551aa55ee1f51cee5aedf8c2c34':
      return 'BattleEffects'
    case '0x359638a3b7e5908f2efe696ef928787916140c8bb3ce20b956a1fb37ddc0957':
      return 'Board'
    case '0x3d4ce02a10392d8ce0660e04285ad75b4c723b1030eba13a3904de397479e54':
      return 'Creature'
    case '0x2febb181a7f6e5196432f8079e21fb0fdacc61b9a78805402d318c49133b66e':
      return 'Draft'
    case '0x5a0f843e99cdc17985f63f3599e79adfd46c533ab2ffa0fe61ab80c2d2d3ba4':
      return 'DraftCard'
    case '0x13e9bfb10bb4257acf6ab176a725a2c8faa9490463fff408fd0fc71a36a73ab':
      return 'DraftOption'
    case '0x239af4eed9d27e1f3d3adc5881865022283f3e9b8f34206efcf7d983e09ddce':
      return 'Entropy'
    case '0x1a3b9b6c5802b83d9a8a21a24d6472b1a47b0529b4b6c805f26f744c22a35a9':
      return 'Game'
    case '0x5bc24229f65f3fe6c3b0c0aa714b5962449dae463dbb418154054a24cb9cadb':
      return 'HandCard'
    case '0xdbeecd6ebdc49d0c7692b3576e074dfa43fcd48c6b060ca8f7379b672e390e':
      return 'Leaderboard'
    case '0x7fe0a5deeba29dc6878ffaa61f30d6e6be2138f1539cc1fb4973e3b08b6c33':
      return 'MonsterNode'
    case '0x9b3c32ba54b0d942bc7303f8a10b99ea5a23135550520e5750957cfaa08db8':
      return 'Node'
    case '0x2ca66fae0338d1ff831ca7ad5ade77cc8ad555c2f5904a958868adc4f5d7ba7':
      return 'PotionNode'
    case '0x4003bd660d2358d7dedc99e3fd20f996915c9674814788bc99c748e935458b2':
      return 'CardNode'
  }
}

export const components = {
  // Game Models
  'Game': {
    gameId: Number(),
    player: null,
    player_name: String(),
    active: Boolean(),
    inDraft: Boolean(),
    inBattle: Boolean(),
    activeBattleId: Number(),
    heroHealth: Number(),
    heroEnergy: Number(),
    heroXp: Number(),
    branch: Number(),
    nodeLevel: Number(),
    monstersSlain: Number(),
    entropyCount: Number()
  },
  'Leaderboard': {
    gameId: Number(),
    player: null,
    player_name: String(),
    score: Number()
  },

  // Draft Models
  'Draft': {
    gameId: Number(),
    cardCount: Number(),
  },
  'DraftOption': {
    gameId: Number(),
    optionId: Number(),
    cardId: Number(),
    level: Number(),
  },
  'DraftCard': {
    gameId: Number(),
    number: Number(),
    cardId: Number(),
    level: Number(),
  },

  // Battle models
  'Battle': {
    battleId: Number(),
    gameId: Number(),
    nodeId: Number(),
    round: Number(),
    cardIndex: Number(),
    roundEnergy: Number(),
    heroHealth: Number(),
    heroEnergy: Number(),
    heroArmor: Number(),
    heroBurn: Number(),
    monsterId: Number(),
    monsterAttack: Number(),
    monsterHealth: Number(),
    branch: Number(),
    deck: 'array'
  },
  'Creature': {
    battleId: Number(),
    creatureId: Number(),
    cardId: Number(),
    cost: Number(),
    attack: Number(),
    health: Number(),
    shield: Number(),
    restingRound: Number()
  },
  'Board': {
    battleId: Number(),
    creature1: Number(),
    creature2: Number(),
    creature3: Number(),
    creature4: Number(),
    creature5: Number(),
    creature6: Number(),
  },
  'HandCard': {
    battleId: Number(),
    handCardNumber: Number(),
    cardId: Number(),
    level: Number(),
  },
  'BattleEffects': {
    battleId: Number(),
    nextSpellReduction: Number(),
    nextCardReduction: Number(),
    freeDiscard: Boolean(),
    damageImmune: Boolean(),
  },

  // Node models
  'Node': {
    nodeId: Number(),
    gameId: Number(),
    branch: Number(),
    nodeType: Number(),
    skippable: Boolean(),
    status: Number(),
    level: Number(),
    parents: 'array',
  },
  'MonsterNode': {
    nodeId: Number(),
    monsterId: Number(),
    attack: Number(),
    health: Number()
  },
  'PotionNode': {
    nodeId: Number(),
    amount: Number(),
  },
  'CardNode': {
    nodeId: Number(),
    cardId: Number(),
    cardLevel: Number(),
  },

  // Entropy models
  'Entropy': {
    gameId: Number(),
    number: Number(),
    blockNumber: Number(),
    blockHash: null
  }
}