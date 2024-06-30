export const translateName = (address) => {
  switch (address) {
    case '0x1c9feb9d69c9956cfae36983de89e1d793483854170ea26ff539cb1a7536ef0':
      return 'Game'
    case '0x3fca6d7a13b72cfdfdf4a97d0ffb89fac6c686a62ced4a04137794363a3e382':
      return 'Draft'
    case '0x3d7669de40ca2ede342ac43d69249b2b5f3f30b50d3f6ac9fb6f884d4876546':
      return 'DraftEntropy'
    case '0x19e6bb4253bb27b892017bce064d94259ebac6537238955c42ea054cc00ab9e':
      return 'GameEffects'
    case '0x28669589d515b52b56e980eabcd4b22e91ddc54dfff38e7feabe0a744c887e9':
      return 'DraftOption'
    case '0x23a5cfb900262c136924e25e043a449f671c1ec33ae08f69a6e2794740534a1':
      return 'DraftCard'
    case '0x15ab3083eaf4d342d74aaf1e18ae7b462ff9a419f686f9a38540186cbbe12f2':
      return 'Battle'
    case '0x1d3626c4d2caeda5d3a8b0d233465d7535c17903dae481c9ba9df6e71c7cbd9':
      return 'HandCard'
    case '0x1b905abc6e99316dfe44d7e37e60964560e95706197d18c16149d2787da1961':
      return 'Creature'
    case '0x21e240f3774724630c2685134af751ba1428730ba62a57396ae0231240e7072':
      return 'Board'
    case '0x29d24f39c721c59ee2afb13fee54793f9776437ad4e78a4381d5d7160e53ab8':
      return 'Leaderboard'
  }
}

export const components = {
  'Game': {
    gameId: null,
    player: null,
    player_name: String(),
    active: Boolean(),
    inDraft: Boolean(),
    inBattle: Boolean(),
    battlesWon: Number(),
    activeBattleId: null,
    heroHealth: Number(),
    heroEnergy: Number(),
    deckIteration: Number()
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
    blockHash: null
  },
  'Battle': {
    battleId: null,
    gameId: null,
    round: Number(),
    deckIteration: Number(),
    cardIndex: Number(),
    heroHealth: Number(),
    heroEnergy: Number(),
    heroArmor: Number(),
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
  'GameEffects': {
    gameId: null,
    cardsDiscarded: Number(),
    creaturesPlayed: Number(),
    spellsPlayed: Number(),
    demonsPlayed: Number(),
    nextSpellReduction: Number(),
    deadCreatures: Number()
  },
}