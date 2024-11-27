import { Box, Typography } from '@mui/material'
import { CARD_DETAILS } from '../helpers/cards'

export const GET_MONSTER = (monsterId, fullName) => {
  let details = CARD_DETAILS(monsterId)

  return {
    id: monsterId,
    monsterId: monsterId,
    name: details.name,
    monsterType: details.creatureType,
    abilities: <>
      <Typography color="primary">{fullName}</Typography>
      {getMonsterAbilities(monsterId)}
    </>
  }
}

const getMonsterAbilities = (monsterId) => {
  switch (Number(monsterId)) {
    case 75:
      return formatAbility({
        effect: "Skeleton takes one less damage from Hunters.",
        reward: "Your Hunters get +1 attack when played."
      })
    case 74:
      return formatAbility({
        effect: "Orc deals one extra damage to Hunters.",
        reward: "Your Hunters get +1 health when played."
      })
    case 73:
      return formatAbility({
        effect: "Gains +1 attack each time a Hunter is played.",
        reward: "Your Hunters get +1 attack when played."
      })
    case 72:
      return formatAbility({
        effect: "Gains +2 health each time a Hunter is played.",
        reward: "Your Hunters get +1 health when played."
      })
    case 71:
      return formatAbility({
        reward: "Your hero restores 5 health."
      })
    case 70:
      return formatAbility({
        effect: "Rat takes one less damage from Magical beasts.",
        reward: "Your Magical beasts get +1 attack when played."
      })
    case 69:
      return formatAbility({
        effect: "Spider deals one extra damage to Magical beasts.",
        reward: "Your Magical beasts get +1 health when played."
      })
    case 68:
      return formatAbility({
        effect: "Gains +1 attack each time a Magical beast is played.",
        reward: "Your Magical beasts get +1 attack when played."
      })
    case 67:
      return formatAbility({
        effect: "Gains +2 health each time a Magical beast is played.",
        reward: "Your Magical beasts get +1 health when played."
      })
    case 66:
      return formatAbility({
        reward: "Your hero restores 5 health."
      })
    case 65:
      return formatAbility({
        effect: "Gnome takes one less damage from Brutes.",
        reward: "Your Brutes get +1 attack when played."
      })
    case 64:
      return formatAbility({
        effect: "Pixie deals one extra damage to Brutes.",
        reward: "Your Brutes get +1 health when played."
      })
    case 63:
      return formatAbility({
        effect: "Kelpie gains +1 attack each time a Brute is played.",
        reward: "Your Brutes get +1 attack when played."
      })
    case 62:
      return formatAbility({
        effect: "Leprechaun gains +2 health each time a Brute is played.",
        reward: "Your Brutes get +1 health when played."
      })
    case 61:
      return formatAbility({
        reward: "Your hero restores 5 health."
      })
    case 60:
      return formatAbility({
        effect: "Ent gains +1 attack each time a Brute is played.",
        reward: "Your Brutes get +1 attack when played."
      })
    case 59:
      return formatAbility({
        ability: "Golem gains +2 attack if you didn't deal damage this turn.",
        reward: "You start with +1 energy."
      })
    case 58:
      return formatAbility({
        ability: "Yeti gains +1 attack if it has less attack than your strongest beast.",
        reward: "Your hero takes one less damage from all sources."
      })
    case 57:
      return formatAbility({
        ability: "Deals damage to your strongest beast equal to its attack.",
        reward: "The first beast you play each turn gets +2 health."
      })
    case 56:
      return formatAbility({
        reward: "Your hero restores 10 health."
      })
    case 55:
      return formatAbility({
        ability: "Deals 2 damage to your hero whenever you play a beast with higher health than its attack.",
        reward: "The first beast you play each turn gets +1 attack."
      })
    case 54:
    case 53:
    case 52:
    case 51:
      return formatAbility({
        reward: "Your hero restores 10 health."
      })
    case 50:
    case 49:
    case 48:
    case 47:
    case 46:
      return formatAbility({
        reward: "Your hero restores 10 health."
      })
    case 45:
    case 44:
    case 43:
    case 42:
    case 41:
      return formatAbility({
        reward: "Your hero restores 15 health."
      })
    case 40:
    case 39:
    case 38:
    case 37:
    case 36:
      return formatAbility({
        reward: "Your hero restores 15 health."
      })
    case 35:
    case 34:
    case 33:
    case 32:
    case 31:
      return formatAbility({
        reward: "Your hero restores 15 health."
      })
    case 30:
      return formatAbility({
        ability: "Deals 3 damage to your hero if you didn't deal damage this turn.",
        reward: "Reduce the cost of the first beast you play each turn by 1."
      })
    case 29:
    case 28:
    case 27:
    case 26:
      return formatAbility({
        reward: "Your hero restores 20 health."
      })
    case 25:
    case 24:
    case 23:
    case 22:
    case 21:
      return formatAbility({
        reward: "Your hero restores 20 health."
      })
    case 20:
      return formatAbility({
        ability: "Wendigo gains +1 attack for each beast in your hand.",
        reward: "Your beasts get +1 attack when played."
      })
    case 19:
    case 18:
    case 17:
    case 16:
      return formatAbility({
        reward: "Your hero restores 20 health."
      })
    case 15:
      return formatAbility({
        ability: "Tarrasque gains +1 attack for each beast that attacked it this turn.",
        reward: "You restore 1 health each time you play a beast."
      })
    case 14:
    case 13:
    case 12:
    case 11:
    case 10:
    case 9:
    case 8:
    case 7:
    case 6:
    case 5:
    case 4:
      return formatAbility({
        reward: "Your hero restores 20 health."
      })
    case 3:
      return formatAbility({
        effect: "Jiangshi starts with +1 attack and +1 health for each Brute in your deck.",
        reward: "Your brutes get +2 attack and +2 health when played."
      })
    case 2:
      return formatAbility({
        ability: "Typhon deals damage to your hero equal to the number of cards in your hand.",
        reward: "When you end your turn, your hero restores health equal to the number of cards in your hand."
      })
    case 1:
      return formatAbility({
        ability: "Warlock destroys a random card from your hand.",
        reward: "You draw an extra card each turn."
      })
    default:
      return <></>
  }
}

const formatAbility = ({ ability, effect, reward }) => {
  return <>
    {ability && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="#ffb260">Ability:</Typography>
    </Box>}
    {ability && <Typography mt={0.5}>
      {ability}
    </Typography>}

    {effect && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="#ffb260">Effect:</Typography>
    </Box>}
    {effect && <Typography mt={0.5}>
      {effect}
    </Typography>}

    {reward && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="#ffb260">Reward:</Typography>
    </Box>}
    {reward && <Typography mt={0.5}>
      {reward}
    </Typography>}
  </>
}

export const BEAST_NAME_PREFIXES = {
  1: "Agony",
  2: "Apocalypse",
  3: "Armageddon",
  4: "Beast",
  5: "Behemoth",
  6: "Blight",
  7: "Blood",
  8: "Bramble",
  9: "Brimstone",
  10: "Brood",
  11: "Carrion",
  12: "Cataclysm",
  13: "Chimeric",
  14: "Corpse",
  15: "Corruption",
  16: "Damnation",
  17: "Death",
  18: "Demon",
  19: "Dire",
  20: "Dragon",
  21: "Dread",
  22: "Doom",
  23: "Dusk",
  24: "Eagle",
  25: "Empyrean",
  26: "Fate",
  27: "Foe",
  28: "Gale",
  29: "Ghoul",
  30: "Gloom",
  31: "Glyph",
  32: "Golem",
  33: "Grim",
  34: "Hate",
  35: "Havoc",
  36: "Honour",
  37: "Horror",
  38: "Hypnotic",
  39: "Kraken",
  40: "Loath",
  41: "Maelstrom",
  42: "Mind",
  43: "Miracle",
  44: "Morbid",
  45: "Oblivion",
  46: "Onslaught",
  47: "Pain",
  48: "Pandemonium",
  49: "Phoenix",
  50: "Plague",
  51: "Rage",
  52: "Rapture",
  53: "Rune",
  54: "Skull",
  55: "Sol",
  56: "Soul",
  57: "Sorrow",
  58: "Spirit",
  59: "Storm",
  60: "Tempest",
  61: "Torment",
  62: "Vengeance",
  63: "Victory",
  64: "Viper",
  65: "Vortex",
  66: "Woe",
  67: "Wrath",
  68: "Lights",
  69: "Shimmering",
};

export const BEAST_NAME_SUFFIXES = {
  1: "Bane",
  2: "Root",
  3: "Bite",
  4: "Song",
  5: "Roar",
  6: "Grasp",
  7: "Instrument",
  8: "Glow",
  9: "Bender",
  10: "Shadow",
  11: "Whisper",
  12: "Shout",
  13: "Growl",
  14: "Tear",
  15: "Peak",
  16: "Form",
  17: "Sun",
  18: "Moon",
};