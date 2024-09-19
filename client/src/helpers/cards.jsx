export const types = {
  CREATURE: 'Creature',
  SPELL: 'Spell'
}

export const tags = {
  SCALABLE: 'Scalable',
  RENEWABLE: 'Renewable',
  ESCALATING: 'Escalating',
  FATIQUE: 'Fatique',
  UNSTABLE: 'Unstable',
  SHIELD: 'Shield',
}

export const fetch_image = (name) => {
  try {
    return new URL(`../assets/images/cards/${name.replace(" ", "_").toLowerCase()}.png`, import.meta.url).href
  } catch (ex) {
    return ""
  }
}

export const fetchBoardCreatures = (data) => {
  return data.creatures.map(card => ({
    ...CARD_DETAILS(card.card_id, card.creature_id, card.level),
    attack: card.attack,
    health: card.health,
    shield: card.shield,
    resting: card.resting_round >= data.battle.round
  }))
}

export const tagMultiplierName = (m) => {
  if (m === 1) {
    return "I"
  }

  if (m === 2) {
    return "II"
  }

  if (m === 3) {
    return "III"
  }
}

export const tagExplainer = (tag) => {
  switch (tag) {
    case tags.ESCALATING:
      return "Card effect increases each tier."
    case tags.SCALABLE:
      return "Attack and health increases each tier."
    case tags.RENEWABLE:
      return "Cost to play decreases each tier."
    case tags.UNSTABLE:
      return "Can only be played once each battle."
    case tags.FATIQUE:
      return "Replenish one less energy each turn."
    case tags.SHIELD:
      return "Prevents the first source of damage."
  }
}

export const fetchCardList = () => {
  return Array(40).fill(0).map((_, i) => {
    return CARD_DETAILS(i + 1, i + 1)
  })
}

export const CARD_DETAILS = (cardId, id, level = 1) => {
  switch (cardId) {
    // ESCALATING
    case 1:
      return {
        id,
        cardId: 1,
        name: 'Wisdom Bringer',
        type: types.CREATURE,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        cost: 6,
        attack: 6,
        health: 6,
        text: `Gain ${3 + level} armor`,
        level,
      }
    case 2:
      return {
        id,
        cardId: 2,
        name: 'Faith Guardian',
        type: types.CREATURE,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        cost: 7,
        attack: 9,
        health: 9,
        text: `Gain ${6 + level} armor`,
        level,
      }
    case 3:
      return {
        id,
        cardId: 3,
        name: 'Solace Bringer',
        type: types.CREATURE,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        cost: 5,
        attack: 4,
        health: 10,
        text: `Gain ${level} armor`,
        level,
      }
    case 4:
      return {
        id,
        cardId: 4,
        name: "Eden Priest",
        type: types.CREATURE,
        cost: 2,
        attack: 2,
        health: 8,
        tag: tags.ESCALATING,
        tagMultiplier: 2,
        text: `All other friendly creatures get +${level * 2} health`,
        level,
      }
    case 5:
      return {
        id,
        cardId: 5,
        name: "Wild Dog",
        type: types.CREATURE,
        cost: 1,
        attack: 1,
        health: 2,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        text: `Gain +${level} attack`,
        level,
      }
    case 6:
      return {
        id,
        cardId: 6,
        name: "Coyote",
        type: types.CREATURE,
        cost: 3,
        attack: 5,
        health: 5,
        tag: tags.ESCALATING,
        tagMultiplier: 2,
        text: `Gain +${2 * level}/+${2 * level}`,
        level,
      }
    case 7:
      return {
        id,
        cardId: 7,
        name: "Fiery Demon",
        type: types.CREATURE,
        cost: 5,
        attack: 15,
        health: 12,
        tag: tags.ESCALATING,
        tagMultiplier: 3,
        text: `Deal ${10 + (3 * level)} damage`,
        level,
      }
    case 8:
      return {
        id,
        cardId: 8,
        name: "Beetle",
        type: types.CREATURE,
        cost: 3,
        attack: 6,
        health: 6,
        tag: tags.ESCALATING,
        tagMultiplier: 2,
        text: `Deal ${4 + (2 * level)} damage`,
        level,
      }
    case 9:
      return {
        id,
        cardId: 9,
        name: "Zephyr",
        type: types.CREATURE,
        cost: 2,
        attack: 5,
        health: 8,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        text: `Your next spell cost ${level} less energy`,
        level,
      }
    case 10:
      return {
        id,
        cardId: 10,
        name: 'Fireball',
        type: types.SPELL,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        cost: 1,
        attack: 0,
        health: 0,
        text: `Deal ${level} damage`,
        level,
      }
    case 11:
      return {
        id,
        cardId: 11,
        name: 'Lightning Strike',
        type: types.SPELL,
        tag: tags.ESCALATING,
        tagMultiplier: 3,
        cost: 3,
        attack: 0,
        health: 0,
        text: `Deal ${3 + (3 * level)} damage`,
        level,
      }
    case 12:
      return {
        id,
        cardId: 12,
        name: 'First Aid',
        type: types.SPELL,
        tag: tags.ESCALATING,
        tagMultiplier: 1,
        cost: 4,
        attack: 0,
        health: 0,
        text: `Gain ${1 + level} armor`,
        level,
      }

    // Scalable
    case 13:
      return {
        id,
        cardId: 13,
        name: 'Grace Warden',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 1,
        cost: 2,
        attack: 7 + level,
        health: 3 + level,
        text: `Gain 2 armor`,
        level,
      }
    case 14:
      return {
        id,
        cardId: 14,
        name: 'Blessing Caster',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 1,
        cost: 3,
        attack: 5 + level,
        health: 4 + level,
        text: `Gain 2 armor`,
        level,
      }
    case 15:
      return {
        id,
        cardId: 15,
        name: 'Gospel Scribe',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 2,
        cost: 4,
        attack: 7 + (2 * level),
        health: 5 + (2 * level),
        text: `Gain 3 armor`,
        level,
      }
    case 16:
      return {
        id,
        cardId: 16,
        name: 'Chant Monk',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 1,
        cost: 3,
        attack: level,
        health: level,
        text: `Give a friendly minion Shield`,
        level,
        requiresTarget: true
      }
    case 17:
      return {
        id,
        cardId: 17,
        name: 'Grim Marauder',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 2,
        cost: 2,
        attack: level * 2,
        health: level * 2,
        level,
      }
    case 18:
      return {
        id,
        cardId: 18,
        name: 'Tasmanian Devil',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 2,
        cost: 3,
        attack: 4 + (level * 2),
        health: 8 + (level * 2),
        level,
      }
    case 19:
      return {
        id,
        cardId: 19,
        name: 'Jackal',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 2,
        cost: 4,
        attack: 16 + (level * 2),
        health: 4 + (level * 2),
        level,
      }
    case 20:
      return {
        id,
        cardId: 20,
        name: 'Binturong',
        type: types.CREATURE,
        tag: tags.SCALABLE,
        tagMultiplier: 2,
        cost: 4,
        attack: 12 + (level * 2),
        health: 14 + (level * 2),
        level,
      }

    // Renewable
    case 21:
      return {
        id,
        cardId: 21,
        name: "Virtue Curate",
        type: types.CREATURE,
        cost: 5,
        attack: 2,
        health: 2,
        tag: tags.RENEWABLE,
        text: `Gain 3 armor`,
        level,
      }
    case 22:
      return {
        id,
        cardId: 22,
        name: "Mercy Giver",
        type: types.CREATURE,
        cost: 6,
        attack: 4,
        health: 4,
        tag: tags.RENEWABLE,
        text: `Gain 3 armor`,
        level,
      }
    case 23:
      return {
        id,
        cardId: 23,
        name: "Celestial Minister",
        type: types.CREATURE,
        cost: 7,
        attack: 7,
        health: 7,
        tag: tags.RENEWABLE,
        text: `Gain 3 armor`,
        level,
      }
    case 24:
      return {
        id,
        cardId: 24,
        name: "Peace Keeper",
        type: types.CREATURE,
        cost: 4,
        attack: 6,
        health: 6,
        tag: tags.RENEWABLE,
        text: `Give a friendly creature 6 attack`,
        level,
        requiresTarget: true
      }
    case 25:
      return {
        id,
        cardId: 25,
        name: "Rat",
        type: types.CREATURE,
        cost: 5,
        attack: 9,
        health: 12,
        tag: tags.RENEWABLE,
        text: ``,
        level,
      }
    case 26:
      return {
        id,
        cardId: 26,
        name: "Bald Eagle",
        type: types.CREATURE,
        cost: 5,
        attack: 4,
        health: 7,
        tag: tags.RENEWABLE,
        text: `Deal 7 damage`,
        level,
      }
    case 27:
      return {
        id,
        cardId: 27,
        name: "Devourer",
        type: types.CREATURE,
        cost: 6,
        attack: 10,
        health: 12,
        tag: tags.RENEWABLE,
        text: ``,
        level,
      }
    case 28:
      return {
        id,
        cardId: 28,
        name: "Rage Infernal",
        type: types.CREATURE,
        cost: 6,
        attack: 4,
        health: 9,
        tag: tags.RENEWABLE,
        text: `Deal 8 damage`,
        level,
      }
    case 29:
      return {
        id,
        cardId: 29,
        name: "Jinx Weaver",
        type: types.CREATURE,
        cost: 5,
        attack: 9,
        health: 12,
        tag: tags.RENEWABLE,
        text: `Your next discard cost no energy`,
        level,
      }
    case 30:
      return {
        id,
        cardId: 30,
        name: 'Blessed Barrier',
        type: types.SPELL,
        cost: 5,
        attack: 0,
        health: 0,
        tag: tags.RENEWABLE,
        text: 'Gain 4 armor',
        level,
      }
    case 31:
      return {
        id,
        cardId: 31,
        name: 'Barricade',
        type: types.SPELL,
        cost: 4,
        attack: 0,
        health: 0,
        tag: tags.RENEWABLE,
        text: 'Gain 4 armor',
        level,
      }
    case 32:
      return {
        id,
        cardId: 32,
        name: "Natures Wrath",
        type: types.SPELL,
        cost: 5,
        attack: 0,
        health: 0,
        tag: tags.RENEWABLE,
        text: `Deal 13 damage`,
        level,
      }
    case 33:
      return {
        id,
        cardId: 33,
        name: "Spark",
        type: types.SPELL,
        cost: 2,
        attack: 0,
        health: 0,
        tag: tags.RENEWABLE,
        text: `Deal 11 damage`,
        level,
      }
    case 34:
      return {
        id,
        cardId: 34,
        name: "Divine Intervention",
        type: types.SPELL,
        cost: 4,
        attack: 0,
        health: 0,
        tag: tags.RENEWABLE,
        text: `Give a friendly creature Shield`,
        level,
        requiresTarget: true
      }
    case 35:
      return {
        id,
        cardId: 35,
        name: "Energy Transfer",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        text: `Your next card cost 1 less energy`,
        level,
      }


    // Unstable
    case 36:
      return {
        id,
        cardId: 36,
        name: "Greater Heal",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        tag: tags.FATIQUE,
        text: `Gain 1 health`,
        level,
      }
    case 37:
      return {
        id,
        cardId: 37,
        name: "Power Injection",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        tag: tags.FATIQUE,
        text: `Gain 3 energy`,
        level,
      }
    case 38:
      return {
        id,
        cardId: 38,
        name: "Shifting Aegis",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        tag: tags.FATIQUE,
        text: `Gain 6 armor`,
        level,
      }
    case 39:
      return {
        id,
        cardId: 39,
        name: "Chaotic Blast",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        tag: tags.FATIQUE,
        text: `Deal 15 damage`,
        level,
      }
    case 40:
      return {
        id,
        cardId: 40,
        name: "Divine Sacrifice",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        tag: tags.FATIQUE,
        text: `Your hero loses 5 health and is immune to damage until next turn`,
        level,
      }
    default:
      return {
        id: 0,
        cardId: 0,
        name: 'Unknown',
        type: types.CREATURE,
        tag: tags.RENEWABLE,
        cost: 2,
        attack: 0,
        health: 0,
        level: 0,
      }
  }
}

export const CardSize = {
  big: { height: '330px', width: '252px' },
  large: { height: '275px', width: '210px' },
  medium: { height: '220px', width: '168px' },
  small: { height: '110px', width: '84px' }
}