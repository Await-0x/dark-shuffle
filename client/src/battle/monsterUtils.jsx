import { Box, Typography } from '@mui/material'
import { CARD_DETAILS } from '../helpers/cards'

export const GET_MONSTER = (monsterId) => {
  let details = CARD_DETAILS(monsterId)

  return {
    id: monsterId,
    monsterId: monsterId,
    name: details.name,
    monsterType: details.creatureType,
    abilities: <>
      <Typography color="primary" variant='h6'>{details.name}</Typography>
      <Typography color="white">{details.creatureType}</Typography>
      {getMonsterAbilities(monsterId)}
    </>
  }
}

const getMonsterAbilities = (monsterId) => {
  switch (Number(monsterId)) {
    case 75:
      return formatAbility({
        effect: "Skeleton takes one less damage from Hunter creatures",
        reward: "Your Hunter creatures get +1 attack"
      })
    case 74:
      return formatAbility({
        effect: "Orc deals one extra damage to Hunter creatures",
        reward: "Your Hunter creatures get +1 health"
      })
    case 73:
      return formatAbility({
        effect: "Gains +1 attack each time a Hunter is played",
        reward: "Your Hunter creatures get +1 attack"
      })
    case 72:
      return formatAbility({
        effect: "Gains +2 health each time a Hunter is played",
        reward: "Your Hunter creatures get +1 health"
      })
    case 71:
      return formatAbility({
        reward: "Your hero restores 5 health"
      })
    case 70:
      return formatAbility({
        effect: "Rat takes one less damage from Magical creatures",
        reward: "Your Magical creatures get +1 attack"
      })
    case 69:
      return formatAbility({
        effect: "Rat deals one extra damage to Magical creatures",
        reward: "Your Magical creatures get +1 health"
      })
    case 68:
      return formatAbility({
        effect: "Gains +1 attack each time a Magical creature is played",
        reward: "Your Magical creatures get +1 attack"
      })
    case 67:
      return formatAbility({
        effect: "Gains +2 health each time a Magical creature is played",
        reward: "Your Magical creatures get +1 health"
      })
    case 66:
      return formatAbility({
        reward: "Your hero restores 5 health"
      })
    case 65:
      return formatAbility({
        effect: "Gnome takes one less damage from Brute creatures",
        reward: "Your Brute creatures get +1 attack"
      })
    case 64:
      return formatAbility({
        effect: "Gnome deals one extra damage to Brutes",
        reward: "Your Brute creatures get +1 health"
      })
    case 63:
      return formatAbility({
        effect: "Gains +1 attack each time a Brute is played",
        reward: "Your Brute creatures get +1 attack"
      })
    case 62:
      return formatAbility({
        effect: "Gains +2 health each time a Brute is played",
        reward: "Your Brute creatures get +1 health"
      })
    case 61:
      return formatAbility({
        reward: "Your hero restores 5 health"
      })
    case 56:
      return formatAbility({
        reward: "Your hero restores 10 health"
      })
    case 51:
      return formatAbility({
        reward: "Your hero restores 10 health"
      })
    case 46:
      return formatAbility({
        reward: "Your hero restores 10 health"
      })
    case 41:
      return formatAbility({
        reward: "Your hero restores 15 health"
      })
    case 36:
      return formatAbility({
        reward: "Your hero restores 15 health"
      })
    case 31:
      return formatAbility({
        reward: "Your hero restores 15 health"
      })
    case 26:
      return formatAbility({
        reward: "Your hero restores 20 health"
      })
    case 21:
      return formatAbility({
        reward: "Your hero restores 20 health"
      })
    case 16:
      return formatAbility({
        reward: "Your hero restores 20 health"
      })
    case 15:
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
    case 3:
      return formatAbility({
        effect: "Starts with +1 attack and +1 health for each Brute in your deck",
        reward: "Your brutes get +2 attack and +2 health"
      })
    case 2:
      return formatAbility({
        ability: "Deals damage to your hero equal to the number of cards in your hand",
        reward: "Your hero restores health equal to the number of cards in your hand each turn"
      })
    case 1:
      return formatAbility({
        ability: "Destroys a random card from your hand",
        reward: "You draw an extra card each turn"
      })
    default:
      return <></>
  }
}

const formatAbility = ({ ability, effect, reward }) => {
  return <>
    {ability && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="primary">Ability:</Typography>
    </Box>}
    {ability && <Typography mt={0.5}>
      {ability}
    </Typography>}

    {effect && <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="primary">Effect:</Typography>
    </Box>}
    {effect && <Typography mt={0.5}>
      {effect}
    </Typography>}

    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      <Typography color="primary">Reward:</Typography>
    </Box>
    <Typography mt={0.5}>
      {reward}
    </Typography>
  </>
}