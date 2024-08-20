import { Box, Typography } from '@mui/material'

export const fetchMonsterImage = (name) => {
  try {
    return new URL(`../assets/images/monsters/${name.replace(" ", "_").toLowerCase()}.png`, import.meta.url).href
  } catch (ex) {
    return ""
  }
}

export const fetchMonsterList = () => {
  return Array(21).fill(0).map((_, i) => {
    return GET_MONSTER(i + 1)
  })
}

export const GET_MONSTER = (monsterId, branch = 1) => {
  switch (Number(monsterId)) {
    case 1:
      return {
        id: 1,
        monsterId: 1,
        name: 'Minotaur',
        abilities: <>
          <Typography color="primary" variant='h6'>Minotaur</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +2 attack each round.</Typography>
        </>,
      }
    case 2:
      return {
        id: 2,
        monsterId: 2,
        name: 'Troll',
        abilities: <>
          <Typography color="primary" variant='h6'>Troll</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Regeneration</Typography>
          </Box>
          <Typography mt={0.5}>Restores (4) health each turn.</Typography>
        </>,
      }
    case 3:
      return {
        id: 3,
        monsterId: 3,
        name: 'Bigfoot',
        abilities: <>
          <Typography color="primary" variant='h6'>Bigfoot</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Thick Skin</Typography>
          </Box>
          <Typography mt={0.5}>Takes (1) less damage from all sources.</Typography>
        </>
      }
    case 4:
      return {
        id: 4,
        monsterId: 4,
        name: 'Chimera',
        abilities: <>
          <Typography color="primary" variant='h6'>Chimera</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Intimidation</Typography>
          </Box>
          <Typography mt={0.5}>Creatures can't attack the same turn they're summoned.</Typography>
        </>
      }
    case 5:
      return {
        id: 5,
        monsterId: 5,
        name: 'Kappa',
        abilities: <>
          <Typography color="primary" variant='h6'>Kappa</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Mind Vision</Typography>
          </Box>
          <Typography mt={0.5}>Creatures cost (1) more.</Typography>
        </>,
      }
    case 6:
      return {
        id: 6,
        monsterId: 6,
        name: 'Spider',
        abilities: <>
          <Typography color="primary" variant='h6'>Spider</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Poison Spray</Typography>
          </Box>
          <Typography mt={0.5}>Deals (2) damage to each creature.</Typography>
        </>,
      }
    case 7:
      return {
        id: 7,
        monsterId: 7,
        name: 'Lich',
        abilities: <>
          <Typography color="primary" variant='h6'>Lich</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Drain Life</Typography>
          </Box>
          <Typography mt={0.5}>Drains (1) life from each character.</Typography>
        </>,
      }
    case 8:
      return {
        id: 8,
        monsterId: 8,
        name: 'Warlock',
        abilities: <>
          <Typography color="primary" variant='h6'>Warlock</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Spell Immunity</Typography>
          </Box>
          <Typography mt={0.5}>
            Immune to all damage from spells.
          </Typography>
        </>,
      }
    case 9:
      return {
        id: 9,
        monsterId: 9,
        name: 'Golem',
        abilities: <>
          <Typography color="primary" variant='h6'>Golem</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Physical Immunity</Typography>
          </Box>
          <Typography mt={0.5}>
            Immune to all damage from creatures.
          </Typography>
        </>,
      }
    case 10:
      return {
        id: 10,
        monsterId: 10,
        name: 'Satori',
        abilities: <>
          <Typography color="primary" variant='h6'>Satori</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Magical Burden</Typography>
          </Box>
          <Typography mt={0.5}>
            Spells cost one more to play.
          </Typography>
        </>,
      }
    case 11:
      return {
        id: 11,
        monsterId: 11,
        name: 'Wraith',
        abilities: <>
          <Typography color="primary" variant='h6'>Wraith</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Desperation</Typography>
          </Box>
          <Typography mt={0.5}>
            Discarding cards cost 1 more energy.
          </Typography>
        </>,
      }
    case 12:
      return {
        id: 12,
        monsterId: 12,
        name: 'Pixie',
        abilities: <>
          <Typography color="primary" variant='h6'>Pixie</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Fatique</Typography>
          </Box>
          <Typography mt={0.5}>
            You replenish one less energy.
          </Typography>
        </>,
      }
    case 13:
      return {
        id: 13,
        monsterId: 13,
        name: 'Weretiger',
        abilities: <>
          <Typography color="primary" variant='h6'>Weretiger</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Paralyzing Fear</Typography>
          </Box>
          <Typography mt={0.5}>
            You start the battle with {branch} less energy.
          </Typography>
        </>,
      }
    case 14:
      return {
        id: 14,
        monsterId: 14,
        name: 'Cyclops',
        abilities: <>
          <Typography color="primary" variant='h6'>Cyclops</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Balance of Power</Typography>
          </Box>
          <Typography mt={0.5}>
            Cyclops sets its attack to its health.
          </Typography>
        </>,
      }
    case 15:
      return {
        id: 15,
        monsterId: 15,
        name: 'Phoenix',
        abilities: <>
          <Typography color="primary" variant='h6'>Phoenix</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Spell Reflection</Typography>
          </Box>
          <Typography mt={0.5}>
            Each time a spell damages Phoenix, your hero takes {branch} damage.
          </Typography>
        </>,
      }
    case 16:
      return {
        id: 16,
        monsterId: 16,
        name: 'Titan',
        abilities: <>
          <Typography color="primary" variant='h6'>Titan</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Pain Reflection</Typography>
          </Box>
          <Typography mt={0.5}>
            Each time a creature damages Titan, your hero takes {branch} damage.
          </Typography>
        </>,
      }
    case 17:
      return {
        id: 17,
        monsterId: 17,
        name: 'Snake',
        abilities: <>
          <Typography color="primary" variant='h6'>Snake</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Burn</Typography>
          </Box>
          <Typography mt={0.5}>
            Applies 1 stack of Burn.
          </Typography>
        </>,
      }
    case 18:
      return {
        id: 18,
        monsterId: 18,
        name: 'Bear',
        abilities: <>
          <Typography color="primary" variant='h6'>Bear</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Frenzy</Typography>
          </Box>
          <Typography mt={0.5}>
            Has double attack below 30 health.
          </Typography>
        </>,
      }
    case 19:
      return {
        id: 19,
        monsterId: 19,
        name: 'Orc',
        abilities: <>
          <Typography color="primary" variant='h6'>Orc</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Piercing Damage</Typography>
          </Box>
          <Typography mt={0.5}>
            3 damage pierces through your armor
          </Typography>
        </>,
      }
    case 20:
      return {
        id: 20,
        monsterId: 20,
        name: 'Rat',
        abilities: <>
          <Typography color="primary" variant='h6'>Rat</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Armor Lock</Typography>
          </Box>
          <Typography mt={0.5}>
            Your can't have more than 10 armor.
          </Typography>
        </>,
      }
    case 21:
      return {
        id: 21,
        monsterId: 21,
        name: 'Yeti',
        abilities: <>
          <Typography color="primary" variant='h6'>Yeti</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography color="primary">★ Thick Fur</Typography>
          </Box>
          <Typography mt={0.5}>
            Has +10 attack when above 50 health.
          </Typography>
        </>,
      }
  }
}
