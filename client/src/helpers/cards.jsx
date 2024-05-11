export const types = {
  CREATURE: 'Creature',
  SPELL: 'Spell'
}

export const tags = {
  SCAVENGER: "Scavenger",
  DEMON: "Demon",
  PRIEST: 'Priest',
}

export const afflixes = {
  SCALABLE: 'Scalable',
  ESCALATING: 'Escalating',
  SHIELD: 'Shield',
}

export const afflixExplainer = (afflix) => {
  switch (afflix) {
    case afflixes.SCALABLE:
      return "Cost one less energy each iteration."
    case afflixes.ESCALATING:
      return "Effect improves each iteration."
    case afflixes.SHIELD:
      return "Prevents the first source of damage."
  }
}

export const fetch_image = (name) => {
  return new URL(`../assets/images/cards/${name.replace(" ", "_").toLowerCase()}.png`, import.meta.url).href
}

export const fetchCard = (cardId, iteration, id) => {
  let card = CARD_LIST.find(card => card.cardId === cardId)

  return {
    ...card,
    id,
    text: getCardText(cardId, iteration),
    cost: card.afflix === afflixes.SCALABLE ? Math.max(0, card.cost - iteration + 1) : card.cost
  }
}

export const CARD_LIST = [
  {
    cardId: 1,
    name: 'Wild Dog',
    type: types.CREATURE,
    tag: tags.SCAVENGER,
    cost: 1,
    attack: 1,
    health: 1,
    afflix: afflixes.ESCALATING
  },
  {
    cardId: 2,
    name: "Wisdom Bringer",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 1,
    attack: 2,
    health: 2,
    afflix: afflixes.ESCALATING
  },
  {
    cardId: 3,
    name: 'Fiery Demon',
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 1,
    attack: 5,
    health: 5,
    afflix: afflixes.ESCALATING
  },
  {
    cardId: 4,
    name: "Zarthos",
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 4,
    attack: 4,
    health: 4,
    afflix: afflixes.ESCALATING
  },
  {
    cardId: 5,
    name: "Faith Guardian",
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 3,
    attack: 1,
    health: 1,
    afflix: afflixes.SCALABLE,
    requiresTarget: true
  },
  {
    cardId: 6,
    name: "Grim Marauder",
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 4,
    attack: 0,
    health: 4,
  },
  {
    cardId: 7,
    name: "Blessing Caster",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 3,
    attack: 4,
    health: 2,
    afflix: afflixes.ESCALATING,
    requiresTarget: true
  },
  {
    cardId: 8,
    name: 'Tasmanian Devil',
    type: types.CREATURE,
    tag: tags.SCAVENGER,
    cost: 5,
    attack: 2,
    health: 2,
    afflix: afflixes.SCALABLE,
  },
  {
    cardId: 9,
    name: 'Jackal',
    type: types.CREATURE,
    tag: tags.SCAVENGER,
    cost: 3,
    attack: 3,
    health: 2,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 10,
    name: "Ghoul Ravager",
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 4,
    attack: 1,
    health: 1,
  },
  {
    cardId: 11,
    name: "Gospel Scribe",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 6,
    attack: 3,
    health: 3,
    afflix: afflixes.SCALABLE,
  },
  {
    cardId: 12,
    name: "Eden Priest",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 4,
    attack: 2,
    health: 2,
    afflix: afflixes.SCALABLE,
  },
  {
    cardId: 13,
    name: 'Coyote',
    type: types.CREATURE,
    tag: tags.SCAVENGER,
    cost: 5,
    attack: 2,
    health: 3,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 14,
    name: "Virtue Curate",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 4,
    attack: 4,
    health: 4,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 15,
    name: "Solace Bringer",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 3,
    attack: 2,
    health: 1,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 16,
    name: "Zephyr",
    type: types.CREATURE,
    tag: tags.DEMON,
    cost: 4,
    attack: 3,
    health: 3,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 17,
    name: "Divine Speaker",
    type: types.CREATURE,
    tag: tags.PRIEST,
    cost: 4,
    attack: 4,
    health: 4,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 18,
    name: 'Fireball',
    type: types.SPELL,
    cost: 2,
    attack: 0,
    health: 0,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 19,
    name: 'Flash Heal',
    type: types.SPELL,
    cost: 2,
    attack: 0,
    health: 0,
    afflix: afflixes.ESCALATING,
  },
  {
    cardId: 20,
    name: 'Greater Heal',
    type: types.SPELL,
    cost: 6,
    attack: 0,
    health: 0,
    afflix: afflixes.SCALABLE,
  },
  {
    cardId: 21,
    name: 'Lava Wave',
    type: types.SPELL,
    cost: 2,
    attack: 0,
    health: 0,
    afflix: afflixes.SCALABLE,
  },
  {
    cardId: 22,
    name: 'Temporal Shift',
    type: types.SPELL,
    cost: 3,
    attack: 0,
    health: 0,
    afflix: afflixes.SCALABLE,
    requiresTarget: true
  },
  {
    cardId: 23,
    name: 'Power Injection',
    type: types.SPELL,
    cost: 1,
    attack: 0,
    health: 0,
    afflix: afflixes.ESCALATING,
    requiresTarget: true
  },
  {
    cardId: 24,
    name: 'Blessed Barrier',
    type: types.SPELL,
    cost: 1,
    attack: 0,
    health: 0,
    afflix: afflixes.SCALABLE,
    requiresTarget: true
  }
]

function getCardText(cardId, iteration) {
  switch (cardId) {
    case 1:
      return `Play: Gain +${iteration}/+${iteration}`
    case 2:
      return `Play: Your hero gains ${iteration} health`
    case 3:
      return `Play: Deal ${Math.max(0, 4 - iteration)} damage to your hero`
    case 4:
      return `Play: Deal ${iteration} damage to an enemy`
    case 5:
      return `Play: Give a friendly creature shield`
    case 6:
      return `Play: Gain attack equal to the number of demons played this game`
    case 7:
      return `Play: Give a friendly creature +${iteration} attack`
    case 8:
      return `Play: Gain 3 energy`
    case 9:
      return `Play: Gain ${iteration} energy`
    case 10:
      return `Play: Gain attack and health equal to the number of cards discarded`
    case 11:
      return `Play: Deal damage to the monster equal to the number of creatures you control`
    case 12:
      return `Play: Your hero gains ${iteration + 3} health`
    case 13:
      return `Play: Gain ${iteration} attack for each creature played this turn`
    case 14:
      return `Play: Your next spell cost ${iteration} less mana`
    case 15:
      return `Play: All other friendly creatures get +${iteration} health`
    case 16:
      return `Play: Gain +${iteration}/+${iteration} for each spell in your hand`
    case 17:
      return `Play: All other friendly creatures get +${iteration} attack`
    case 18:
      return `Deal ${iteration + 2} damage to the enemy monster`
    case 19:
      return `Restore ${iteration + 2} health to your hero`
    case 20:
      return `Restore 8 health to your hero`
    case 21:
      return `Deal 10 damage to the enemy monster`
    case 22:
      return `Swap the attack and health of a creature`
    case 23:
      return `Give a creature +${iteration + 1} attack`
    case 24:
      return `Give a friendly minion Shield`
  }

  return `Missing text`
}


export const CardSize = {
  big: { height: '330px', width: '252px' },
  medium: { height: '220px', width: '168px' },
  small: { height: '110px', width: '84px' }
}