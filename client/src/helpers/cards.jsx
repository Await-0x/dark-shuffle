export const types = {
  CREATURE: 'Creature',
  SPELL: 'Spell'
}

export const afflixes = {
  SCALABLE: 'Scalable',
  RENEWABLE: 'Renewable',
  ESCALATING: 'Escalating',
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

export const afflixExplainer = (afflix) => {
  switch (afflix) {
    case afflixes.ESCALATING:
      return "Effect increases each tier"
    case afflixes.SCALABLE:
      return "Stats increases each tier"
    case afflixes.RENEWABLE:
      return "Cost decreases each tier"
    case afflixes.UNSTABLE:
      return "Can only be played once each battle"
    case afflixes.SHIELD:
      return "Prevents the first source of damage"
  }
}

export const fetchCardList = () => {
  return Array.from(40).fill(0).map((_, i) => {
    return CARD_DETAILS(i + 1, i + 1)
  })
}

export const CARD_DETAILS = (cardId, id, level = 1) => {
  switch(cardId) {
    // ESCALATING
    case 1:
      return {
        id,
        cardId: 1,
        name: 'Wisdom Bringer',
        type: types.CREATURE,
        afflix: afflixes.ESCALATING,
        cost: 3,
        attack: 3,
        health: 6,
        text: `Play: Gain ${level} armor`,
        level,
      }
    case 2:
      return {
        id,
        cardId: 2,
        name: 'Faith Guardian',
        type: types.CREATURE,
        afflix: afflixes.ESCALATING,
        cost: 4,
        attack: 5,
        health: 2,
        text: `Play: Gain ${1 + level} armor`,
        level,
      }
    case 3:
      return {
        id,
        cardId: 3,
        name: 'Solace Bringer',
        type: types.CREATURE,
        afflix: afflixes.ESCALATING,
        cost: 5,
        attack: 4,
        health: 10,
        text: `Play: Gain ${1 + level} armor`,
        level,
      }
    case 4:
      return {
        id,
        cardId: 4,
        name: "Eden Priest",
        type: types.CREATURE,
        cost: 3,
        attack: 2,
        health: 8,
        afflix: afflixes.ESCALATING,
        text: `Play: All other friendly creatures get +${level} health`,
      }
    case 5:
      return {
        id,
        cardId: 5,
        name: "Wild Dog",
        type: types.CREATURE,
        cost: 1,
        attack: 5,
        health: 2,
        afflix: afflixes.ESCALATING,
        text: `Play: Gain +${level} attack`,
      }
    case 6:
      return {
        id,
        cardId: 6,
        name: "Coyote",
        type: types.CREATURE,
        cost: 2,
        attack: 5,
        health: 5,
        afflix: afflixes.ESCALATING,
        text: `Play: Gain +${level}/+${level}`,
      }
    case 7:
      return {
        id,
        cardId: 7,
        name: "Fiery Demon",
        type: types.CREATURE,
        cost: 6,
        attack: 9,
        health: 6,
        afflix: afflixes.ESCALATING,
        text: `Play: Deal ${3 + level} damage`,
      }
    case 8:
      return {
        id,
        cardId: 8,
        name: "Coyote",
        type: types.CREATURE,
        cost: 4,
        attack: 6,
        health: 6,
        afflix: afflixes.ESCALATING,
        text: `Play: Deal ${level} damage`,
      }
    case 9:
      return {
        id,
        cardId: 9,
        name: "Zephyr",
        type: types.CREATURE,
        cost: 4,
        attack: 5,
        health: 8,
        afflix: afflixes.ESCALATING,
        text: `Play: Your next spell cost ${level} less energy`,
      }
    case 10:
      return {
        id,
        cardId: 10,
        name: 'Fireball',
        type: types.SPELL,
        afflix: afflixes.ESCALATING,
        cost: 1,
        attack: 0,
        health: 0,
        text: `Deal ${6 + level} damage`
      }
    case 11:
      return {
        id,
        cardId: 11,
        name: 'Lightning Strike',
        type: types.SPELL,
        afflix: afflixes.ESCALATING,
        cost: 3,
        attack: 0,
        health: 0,
        text: `Deal ${12 + level} damage`
      }
    case 12:
      return {
        id,
        cardId: 12,
        name: 'First Aid',
        type: types.SPELL,
        afflix: afflixes.ESCALATING,
        cost: 1,
        attack: 0,
        health: 0,
        text: `Gain ${level} armor`
      }

    // Scalable
    case 13:
      return {
        id,
        cardId: 13,
        name: 'Grace Warden',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 2,
        attack: 3 + level,
        health: 7 + level,
        level,
        text: `Play: Gain 1 armor`
      }
    case 14:
      return {
        id,
        cardId: 14,
        name: 'Blessing Caster',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 3,
        attack: 5 + level,
        health: 4 + level,
        level,
        text: `Play: Gain 2 armor`
      }
    case 15:
      return {
        id,
        cardId: 15,
        name: 'Gospel Scribe',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 5,
        attack: 7 + level,
        health: 5 + level,
        level,
        text: `Play: Gain 3 armor`
      }
    case 16:
      return {
        id,
        cardId: 16,
        name: 'Chant Monk',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 4,
        attack: level,
        health: level,
        level,
        text: `Play: Give a friendly minion Shield`
      }
    case 17:
      return {
        id,
        cardId: 17,
        name: 'Grim Marauder',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 2,
        attack: 5 + level,
        health: 8 + level,
        level,
      }
    case 18:
      return {
        id,
        cardId: 18,
        name: 'Tasmanian Devil',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 3,
        attack: 7 + level,
        health: 10 + level,
        level,
      }
    case 19:
      return {
        id,
        cardId: 19,
        name: 'Jackal',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 4,
        attack: 14 + level,
        health: 2 + level,
        level,
      }
    case 20:
      return {
        id,
        cardId: 20,
        name: 'Binturong',
        type: types.CREATURE,
        afflix: afflixes.SCALABLE,
        cost: 5,
        attack: 9 + level,
        health: 18 + level,
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
        afflix: afflixes.RENEWABLE,
        text: `Play: Gain 5 armor`,
      }
    case 22:
      return {
        id,
        cardId: 22,
        name: "Mercy Giver",
        type: types.CREATURE,
        cost: 6,
        attack: 1,
        health: 4,
        afflix: afflixes.RENEWABLE,
        text: `Play: Gain 6 armor`,
      }
    case 23:
      return {
        id,
        cardId: 23,
        name: "Celestial Minister",
        type: types.CREATURE,
        cost: 7,
        attack: 2,
        health: 2,
        afflix: afflixes.RENEWABLE,
        text: `Play: Gain 7 armor`,
      }
    case 24:
      return {
        id,
        cardId: 24,
        name: "Peace Giver",
        type: types.CREATURE,
        cost: 4,
        attack: 6,
        health: 6,
        afflix: afflixes.RENEWABLE,
        text: `Play: Give a friendly creature 6 attack`,
      }
    case 25:
      return {
        id,
        cardId: 25,
        name: "Rat",
        type: types.CREATURE,
        cost: 5,
        attack: 13,
        health: 13,
        afflix: afflixes.RENEWABLE,
        text: ``,
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
        afflix: afflixes.RENEWABLE,
        text: `Play: Deal 12 damage`,
      }
    case 27:
      return {
        id,
        cardId: 27,
        name: "Devourer",
        type: types.CREATURE,
        cost: 6,
        attack: 15,
        health: 15,
        afflix: afflixes.RENEWABLE,
        text: ``,
      }
    case 28:
      return {
        id,
        cardId: 28,
        name: "Rage Infernal",
        type: types.CREATURE,
        cost: 6,
        attack: 10,
        health: 9,
        afflix: afflixes.RENEWABLE,
        text: `Play: Deal 8 damage`,
      }
    case 29:
      return {
        id,
        cardId: 29,
        name: "Jinx Weaver",
        type: types.CREATURE,
        cost: 6,
        attack: 9,
        health: 12,
        afflix: afflixes.RENEWABLE,
        text: `Play: Discard your next card for 0 energy`,
      }
    case 30:
      return {
        id,
        cardId: 30,
        name: 'Blessed Barrier',
        type: types.SPELL,
        cost: 8,
        attack: 0,
        health: 0,
        afflix: afflixes.RENEWABLE,
        text: 'Gain 8 armor',
        requiresTarget: true
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
        afflix: afflixes.RENEWABLE,
        text: 'Gain 4 armor',
        requiresTarget: true
      }
    case 32:
      return {
        id,
        cardId: 32,
        name: "Nature's Wrath",
        type: types.SPELL,
        cost: 5,
        attack: 0,
        health: 0,
        afflix: afflixes.RENEWABLE,
        text: `Deal 21 damage`,
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
        afflix: afflixes.RENEWABLE,
        text: `Deal 12 damage`,
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
        afflix: afflixes.RENEWABLE,
        text: `Give a friendly creature Shield`,
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
        afflix: afflixes.UNSTABLE,
        text: `Gain 3 health`,
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
        afflix: afflixes.UNSTABLE,
        text: `Gain 5 energy`,
      }
    case 38:
      return {
        id,
        cardId: 38,
        name: "Unstable 4",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        afflix: afflixes.UNSTABLE,
        text: `Gain 5 armor`,
      }
    case 39:
      return {
        id,
        cardId: 39,
        name: "Unstable 5",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        afflix: afflixes.UNSTABLE,
        text: `Deal 15 damage`,
      }
    case 40:
      return {
        id,
        cardId: 40,
        name: "Unstable 1",
        type: types.SPELL,
        cost: 1,
        attack: 0,
        health: 0,
        afflix: afflixes.UNSTABLE,
        text: `Your hero are immunue to damage next turn`,
      }
    default:
      return {
        id: 0,
        cardId: 0,
        name: 'Unknown',
        type: types.CREATURE,
        afflix: afflixes.RENEWABLE,
        cost: 2,
        attack: 0,
        health: 0,
        level: 0,
      }
  }
}

export const CardSize = {
  big: { height: '330px', width: '252px' },
  medium: { height: '220px', width: '168px' },
  small: { height: '110px', width: '84px' }
}