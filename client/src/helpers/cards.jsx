export const types = {
  CREATURE: 'Creature',
  SPELL: 'Spell'
}

export const tags = {
  MAGICAL: 'Magical',
  HUNTER: 'Hunter',
  BRUTE: 'Brute',
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

export const fetchCardList = () => {
  return Array(74).fill(0).map((_, i) => {
    return CARD_DETAILS(i + 1, i + 1)
  })
}

export const CARD_DETAILS = (cardId, id) => {
  switch (cardId) {
    case 1:
      return {
          id,
          card_id: 1,
          name: 'Warlock',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 3,
          health: 4,
          text: "When Played: Magical allies gains +2 attack. If no other Magical ally is in play, reduce the enemy's attack by 2"
      };

    case 2:
      return {
          id,
          card_id: 2,
          name: 'Typhon',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.MAGICAL,
          cost: 5,
          attack: 6,
          health: 6,
          text: "On Attack: Heals the hero by 2 if the enemy is a Brute and gains +1 health for every Magical ally in play"
      };
  
    case 3:
      return {
          id,
          card_id: 3,
          name: 'Jiangshi',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.MAGICAL,
          cost: 3,
          attack: 5,
          health: 4,
          text: "On Death: Reduce the enemy's attack by 2. All other Magical allies gain +2 attack if the enemy is a Brute"
      };
  
    case 4:
      return {
          id,
          card_id: 4,
          name: 'Anansi',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.MAGICAL,
          cost: 4,
          attack: 4,
          health: 5,
          text: "When Played: Grants all allies +2 attack. If the enemy is a Brute, inflict 3 damage immediately"
      };
  
    case 5:
      return {
          id,
          card_id: 5,
          name: 'Basilisk',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.MAGICAL,
          cost: 1,
          attack: 3,
          health: 2,
          text: "On Attack: Deals an additional 2 damage if two or more Magical allies are in play. Prevents the enemy from healing if Basilisk is in play"
      };

    case 6:
      return {
          id,
          card_id: 6,
          name: 'Griffin',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.HUNTER,
          cost: 5,
          attack: 6,
          health: 4,
          text: "On Attack: Deals 5 extra damage if the enemy is Magical"
      };
  
    case 7:
      return {
          id,
          card_id: 7,
          name: 'Manticore',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.HUNTER,
          cost: 3,
          attack: 4,
          health: 5,
          text: "When Played: Marks the enemy to take 2 additional damage. If the enemy is Magical, increase this to 3"
      };
  
    case 8:
      return {
          id,
          card_id: 8,
          name: 'Phoenix',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.HUNTER,
          cost: 1,
          attack: 3,
          health: 2,
          text: "On Attack: Gains +1 attack for each Hunter ally in play"
      };
  
    case 9:
      return {
          id,
          card_id: 9,
          name: 'Dragon',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 4,
          health: 3,
          text: "When Played: Deals 4 damage if the enemy is Magical. Otherwise, deals 2 damage"
      };

    case 10:
      return {
          id,
          card_id: 10,
          name: 'Minotaur',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.HUNTER,
          cost: 4,
          attack: 5,
          health: 4,
          text: "On Death: Grants +2 attack to the next Hunter played. If the enemy is Magical, the bonus increases to +4 attack"
      };
  
    case 11:
      return {
          id,
          card_id: 11,
          name: 'Kraken',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.BRUTE,
          cost: 1,
          attack: 3,
          health: 5,
          text: "On Death: Grants all Brute allies +2 attack. If the enemy is a Hunter, it loses 2 attack"
      };
  
    case 12:
      return {
          id,
          card_id: 12,
          name: 'Colossus',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.BRUTE,
          cost: 5,
          attack: 5,
          health: 7,
          text: "When Played: Reduces all damage to the hero by 1 for the rest of the battle"
      };
  
    case 13:
      return {
          id,
          card_id: 13,
          name: 'Balrog',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.BRUTE,
          cost: 3,
          attack: 4,
          health: 6,
          text: "On Attack: Deals an extra 2 damage if the enemy is a Hunter and gains +1 attack if another Brute is in play"
      };

    case 14:
      return {
          id,
          card_id: 14,
          name: 'Leviathan',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 4,
          health: 3,
          text: "When Played: Gains +2 health if another Brute ally is in play. Deals an additional 3 damage to Hunters when it attacks"
      };

    case 15:
      return {
          id,
          card_id: 15,
          name: 'Tarrasque',
          card_type: types.CREATURE,
          card_tier: 1,
          creature_type: tags.BRUTE,
          cost: 4,
          attack: 3,
          health: 5,
          text: "On Death: Grants +3 health to the next Brute played. If the enemy is a Hunter, grants +5 health instead"
      };

    case 16:
      return {
          id,
          card_id: 16,
          name: 'Gorgon',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 3,
          health: 3,
          text: "On Death: Reduces the enemy's attack by 1 if the enemy is a Brute. All other Magical allies gain +1 attack"
      };

    case 17:
      return {
          id,
          card_id: 17,
          name: 'Kitsune',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.MAGICAL,
          cost: 4,
          attack: 4,
          health: 3,
          text: "When Played: Gain +1 attack if the enemy is a Brute. Gain +1 attack if a Magical ally is in play"
      };

    case 18:
      return {
          id,
          card_id: 18,
          name: 'Lich',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.MAGICAL,
          cost: 5,
          attack: 2,
          health: 4,
          text: "When Played: Increase the hero's mana by 1. Grants +1 health to the hero if another Magical ally is in play"
      };

    case 19:
      return {
          id,
          card_id: 19,
          name: 'Chimera',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.MAGICAL,
          cost: 3,
          attack: 3,
          health: 4,
          text: "On Death: Deals 2 damage to the enemy. If the enemy is a Brute, also reduce their attack by 1"
      };

    case 20:
      return {
          id,
          card_id: 20,
          name: 'Wendigo',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.MAGICAL,
          cost: 1,
          attack: 1,
          health: 1,
          text: "On Attack: Reduces the enemy's attack by 1 if the enemy is a Brute. Grants 1 energy to the hero if another Magical ally is in play"
      };

    case 21:
      return {
          id,
          card_id: 21,
          name: 'Qilin',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.HUNTER,
          cost: 1,
          attack: 3,
          health: 2,
          text: "On Attack: Deals 1 extra damage if the enemy is Magical. Gains +1 health if it survives combat"
      };

    case 22:
      return {
          id,
          card_id: 22,
          name: 'Ammit',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.HUNTER,
          cost: 4,
          attack: 5,
          health: 2,
          text: "When Played: Gains +2 attack if there are no other Hunter allies in play"
      };

    case 23:
      return {
          id,
          card_id: 23,
          name: 'Nue',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.HUNTER,
          cost: 3,
          attack: 4,
          health: 2,
          text: "On Attack: Gains +1 attack if the enemy is Magical and deals 1 extra damage if another Hunter ally is in play"
      };

    case 24:
      return {
          id,
          card_id: 24,
          name: 'Skinwalker',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.HUNTER,
          cost: 5,
          attack: 5,
          health: 3,
          text: "When Played: Marks the enemy to take 1 additional damage. If the enemy is Magical, increase the damage to 2"
      };

    case 25:
      return {
          id,
          card_id: 25,
          name: 'Chupacabra',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 2,
          health: 3,
          text: "On Death: Grants +2 attack to the next Hunter played. Also grants +2 health if the enemy is Magical"
      };

    case 26:
      return {
          id,
          card_id: 26,
          name: 'Titan',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 3,
          health: 5,
          text: "On Death: Restores 2 health to the hero if the enemy is a Hunter"
      };

    case 27:
      return {
          id,
          card_id: 27,
          name: 'Nephilim',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.BRUTE,
          cost: 5,
          attack: 4,
          health: 4,
          text: "Nephilim takes 1 less damage from all sources. If another Brute ally is in play, increase this to 2"
      };

    case 28:
      return {
          id,
          card_id: 28,
          name: 'Behemoth',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.BRUTE,
          cost: 3,
          attack: 4,
          health: 3,
          text: "On Attack: Gains +2 health if the enemy is a Hunter"
      };

    case 29:
      return {
          id,
          card_id: 29,
          name: 'Hydra',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.BRUTE,
          cost: 1,
          attack: 3,
          health: 2,
          text: "On Death: Grants +2 health to the next Brute played"
      };

    case 30:
      return {
          id,
          card_id: 30,
          name: 'Juggernaut',
          card_type: types.CREATURE,
          card_tier: 2,
          creature_type: tags.BRUTE,
          cost: 4,
          attack: 3,
          health: 4,
          text: "On Death: Grants +1 attack to the next Brute played"
      };

    case 31:
      return {
          id,
          card_id: 31,
          name: 'Rakshasa',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.MAGICAL,
          cost: 3,
          attack: 4,
          health: 4,
          text: "When Played: If the enemy is a Brute, reduce the enemy's attack by 1 and grant +1 health to other Magical allies"
      };

    case 32:
      return {
          id,
          card_id: 32,
          name: 'Werewolf',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 3,
          health: 3,
          text: "On Attack: Deals 1 extra damage if another Magical ally is in play. Gains +1 health if it survives combat"
      };

    case 33:
      return {
          id,
          card_id: 33,
          name: 'Banshee',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.MAGICAL,
          cost: 5,
          attack: 5,
          health: 3,
          text: "On Death: Grants +1 health to the hero if the enemy is a Brute. All other Magical allies gain +1 attack"
      };

    case 34:
      return {
          id,
          card_id: 34,
          name: 'Draugr',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.MAGICAL,
          cost: 1,
          attack: 2,
          health: 2,
          text: "When Played: Magical allies gain +1 attack. If there are two or more other Magical allies, gain 1 energy"
      };

    case 35:
      return {
          id,
          card_id: 35,
          name: 'Vampire',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.MAGICAL,
          cost: 4,
          attack: 4,
          health: 3,
          text: "On Attack: Deals 1 extra damage to the enemy if it's a Brute. If Vampire is the only Magical ally in play, it gains +1 attack"
      };

    case 36:
      return {
          id,
          card_id: 36,
          name: 'Weretiger',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.HUNTER,
          cost: 5,
          attack: 5,
          health: 3,
          text: "When Played: Marks the enemy, causing it to take 1 additional damage."
      };

    case 37:
      return {
          id,
          card_id: 37,
          name: 'Wyvern',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.HUNTER,
          cost: 1,
          attack: 3,
          health: 2,
          text: "On Attack: Deals 1 extra damage if there is another Hunter ally in play and gains +1 attack if enemy is Magical"
      };

    case 38:
      return {
          id,
          card_id: 38,
          name: 'Roc',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.HUNTER,
          cost: 4,
          attack: 4,
          health: 4,
          text: "On Death: Grants +1 attack to the next Hunter played. Also gains +1 health if the enemy is Magical"
      };

    case 39:
      return {
          id,
          card_id: 39,
          name: 'Harpy',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 3,
          health: 3,
          text: "When Played: Gain +1 attack if another Hunter ally is in play. If the enemy is Magical, Hunter allies gain +1 attack"
      };

    case 40:
      return {
          id,
          card_id: 40,
          name: 'Pegasus',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.HUNTER,
          cost: 3,
          attack: 4,
          health: 2,
          text: "On Attack: Deals 1 extra damage if the enemy is Magical. Gains +1 attack each time the hero takes damage"
      };

    case 41:
      return {
          id,
          card_id: 41,
          name: 'Oni',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.BRUTE,
          cost: 3,
          attack: 3,
          health: 5,
          text: "On Death: Grants +1 attack to all Brute allies if the enemy is a Hunter"
      };

    case 42:
      return {
          id,
          card_id: 42,
          name: 'Jotunn',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 4,
          health: 3,
          text: "When Played: Gains +1 attack if another Brute ally is in play. If the enemy is a Hunter, it also gains +1 health"
      };

    case 43:
      return {
          id,
          card_id: 43,
          name: 'Ettin',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.BRUTE,
          cost: 5,
          attack: 5,
          health: 3,
          text: "On Attack: Gains +2 health if the enemy is a Hunter"
      };

    case 44:
      return {
          id,
          card_id: 44,
          name: 'Cyclops',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.BRUTE,
          cost: 4,
          attack: 3,
          health: 4,
          text: "When Played: Reduce the enemy's attack by 1 if the enemy is a Hunter. If another Brute ally is in play, Cyclops gains +1 attack"
      };

    case 45:
      return {
          id,
          card_id: 45,
          name: 'Giant',
          card_type: types.CREATURE,
          card_tier: 3,
          creature_type: tags.BRUTE,
          cost: 1,
          attack: 2,
          health: 3,
          text: "On Death: Grants +1 health to the hero if the enemy is a Hunter. If Giant is the only Brute in play, this bonus is doubled"
      };

    case 46:
      return {
          id,
          card_id: 46,
          name: 'Goblin',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 2,
          health: 3,
          text: "On Attack: Deals 1 extra damage if the enemy is a Brute. Gains +1 attack after it attacks"
      };

    case 47:
      return {
          id,
          card_id: 47,
          name: 'Ghoul',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.MAGICAL,
          cost: 1,
          attack: 2,
          health: 2,
          text: "When Played: Reduce the enemy's attack by 1 if it's a Brute"
      };

    case 48:
      return {
          id,
          card_id: 48,
          name: 'Wraith',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.MAGICAL,
          cost: 3,
          attack: 3,
          health: 2,
          text: "On Death: Grants +1 health to the hero if another Magical ally is in play. If no other Magical ally is in play, it grants +1 energy instead"
      };

    case 49:
      return {
          id,
          card_id: 49,
          name: 'Sprite',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 2,
          health: 3,
          text: "When Played: Increase the attack of all other Magical allies by 1"
      };

    case 50:
      return {
          id,
          card_id: 50,
          name: 'Kappa',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.MAGICAL,
          cost: 4,
          attack: 3,
          health: 3,
          text: "On Attack: Gains +1 attack if the enemy is a Brute"
      };

    case 51:
      return {
          id,
          card_id: 51,
          name: 'Hippogriff',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.HUNTER,
          cost: 1,
          attack: 3,
          health: 1,
          text: "When Played: Deals 1 damage if the enemy is Magical"
      };

    case 52:
      return {
          id,
          card_id: 52,
          name: 'Fenrir',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 2,
          health: 2,
          text: "On Attack: Deals 1 extra damage if another Hunter ally is in play. Gains +1 health if there are no other Hunter allies"
      };

    case 53:
      return {
          id,
          card_id: 53,
          name: 'Jaguar',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.HUNTER,
          cost: 3,
          attack: 2,
          health: 3,
          text: "On Death: Grants +1 attack to the next Hunter played if the enemy is Magical"
      };

    case 54:
      return {
          id,
          card_id: 54,
          name: 'Satori',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.HUNTER,
          cost: 4,
          attack: 4,
          health: 2,
          text: "When Played: Marks the enemy to take 1 additional damage if it's Magical"
      };

    case 55:
      return {
          id,
          card_id: 55,
          name: 'Direwolf',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 2,
          health: 2,
          text: "On Attack: Deals 1 extra damage to the enemy if it's Magical"
      };

    case 56:
      return {
          id,
          card_id: 56,
          name: 'NemeanLion',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.BRUTE,
          cost: 3,
          attack: 2,
          health: 4,
          text: "On Death: Grants +1 attack to all Brute allies if the enemy is a Hunter"
      };

    case 57:
      return {
          id,
          card_id: 57,
          name: 'Berserker',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 3,
          health: 2,
          text: "On Attack: Deals 1 extra damage to the enemy if the enemy is a Hunter"
      };

    case 58:
      return {
          id,
          card_id: 58,
          name: 'Yeti',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.BRUTE,
          cost: 1,
          attack: 3,
          health: 2,
          text: "When Played: Gains +1 health if there is another Brute ally in play"
      };

    case 59:
      return {
          id,
          card_id: 59,
          name: 'Golem',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.BRUTE,
          cost: 4,
          attack: 4,
          health: 2,
          text: "When Played: Reduce the enemy's attack by 1 if the enemy is a Hunter"
      };

    case 60:
      return {
          id,
          card_id: 60,
          name: 'Ent',
          card_type: types.CREATURE,
          card_tier: 4,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 2,
          health: 3,
          text: "On Death: Grants +1 health to the hero if the enemy is a Hunter"
      };

    case 61:
      return {
          id,
          card_id: 61,
          name: 'Fairy',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.MAGICAL,
          cost: 4,
          attack: 3,
          health: 3,
          text: "On Death: Reduce the enemy's attack by 1 if it's a Brute"
      };

    case 62:
      return {
          id,
          card_id: 62,
          name: 'Leprechaun',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.MAGICAL,
          cost: 2,
          attack: 2,
          health: 2,
          text: "On Attack: Deals 1 extra damage if there is another Magical ally in play"
      };

    case 63:
      return {
          id,
          card_id: 63,
          name: 'Kelpie',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.MAGICAL,
          cost: 1,
          attack: 1,
          health: 2,
          text: "When Played: Gain +2 attack if the enemy is a Brute"
      };

    case 64:
      return {
          id,
          card_id: 64,
          name: 'Pixie',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.MAGICAL,
          cost: 3,
          attack: 2,
          health: 3,
          text: "On Death: Grants +1 health to the hero if the enemy is a Brute"
      };

    case 65:
      return {
          id,
          card_id: 65,
          name: 'Gnome',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.MAGICAL,
          cost: 5,
          attack: 4,
          health: 3,
          text: "On Attack: Deals 1 extra damage if the enemy is a Brute"
      };

    case 66:
      return {
          id,
          card_id: 66,
          name: 'Bear',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.HUNTER,
          cost: 4,
          attack: 3,
          health: 3,
          text: "When Played: Deals 1 damage if the enemy is Magical"
      };

    case 67:
      return {
          id,
          card_id: 67,
          name: 'Wolf',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.HUNTER,
          cost: 2,
          attack: 2,
          health: 2,
          text: "On Attack: Deals 1 extra damage if another Hunter ally is in play"
      };

    case 68:
      return {
          id,
          card_id: 68,
          name: 'Mantis',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.HUNTER,
          cost: 1,
          attack: 1,
          health: 1,
          text: "On Death: Grants +1 attack to the next Hunter played if the enemy is Magical"
      };

    case 69:
      return {
          id,
          card_id: 69,
          name: 'Spider',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.HUNTER,
          cost: 3,
          attack: 3,
          health: 2,
          text: "On Attack: Deals 1 extra damage if the enemy is Magical"
      };

    case 70:
      return {
          id,
          card_id: 70,
          name: 'Rat',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.HUNTER,
          cost: 5,
          attack: 4,
          health: 4,
          text: "When Played: Gains +1 attack if there's another Hunter ally in play"
      };

    case 71:
      return {
          id,
          card_id: 71,
          name: 'Troll',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.BRUTE,
          cost: 4,
          attack: 3,
          health: 4,
          text: "On Death: Grants +1 attack to all Brute allies if the enemy is a Hunter"
      };

    case 72:
      return {
          id,
          card_id: 72,
          name: 'Bigfoot',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.BRUTE,
          cost: 2,
          attack: 3,
          health: 2,
          text: "When Played: Deals 1 damage if the enemy is a Hunter"
      };

    case 73:
      return {
          id,
          card_id: 73,
          name: 'Ogre',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.BRUTE,
          cost: 1,
          attack: 1,
          health: 2,
          text: "On Death: Grants +1 health to the hero if the enemy is a Hunter"
      };

    case 74:
      return {
          id,
          card_id: 74,
          name: 'Orc',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.BRUTE,
          cost: 3,
          attack: 2,
          health: 3,
          text: "When Played: Reduce the enemy's attack by 1 if it's a Hunter"
      };

    case 75:
      return {
          id,
          card_id: 75,
          name: 'Skeleton',
          card_type: types.CREATURE,
          card_tier: 5,
          creature_type: tags.BRUTE,
          cost: 5,
          attack: 4,
          health: 3,
          text: "On Attack: Deals 1 extra damage if there is another Brute ally in play"
      };

    default:
      return {
        id,
        card_id: 0,
        name: 'Unknown',
        card_type: 'None',
        creature_type: 'None',
        card_tier: 0,
        cost: 2,
        attack: 0,
        health: 0,
        text: ""
      }
  }
}

export const CardSize = {
  big: { height: '330px', width: '252px' },
  large: { height: '275px', width: '210px' },
  medium: { height: '220px', width: '168px' },
  small: { height: '110px', width: '84px' }
}