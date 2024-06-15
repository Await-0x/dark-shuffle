import minotaur from '../assets/images/monsters/minotaur.png'
import troll from "../assets/images/monsters/troll.png"
import bigfoot from "../assets/images/monsters/bigfoot.png"
import chimera from "../assets/images/monsters/chimera.png"
import kappa from "../assets/images/monsters/kappa.png"
import spider from "../assets/images/monsters/spider.png"
import lich from "../assets/images/monsters/lich.png"
import { Box, Typography } from '@mui/material'

export const MONSTER_LIST = [
  {
    id: 401,
    monsterId: 401,
    image: <img alt='' src={minotaur} height={'100%'} />,
    abilities: [],
    attack: 1,
    health: 20,
  },
  {
    id: 402,
    monsterId: 402,
    image: <img alt='' src={troll} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
  {
    id: 403,
    monsterId: 403,
    image: <img alt='' src={bigfoot} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
  {
    id: 404,
    monsterId: 404,
    image: <img alt='' src={chimera} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
  {
    id: 405,
    monsterId: 405,
    image: <img alt='' src={kappa} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
  {
    id: 406,
    monsterId: 406,
    image: <img alt='' src={spider} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
  {
    id: 407,
    monsterId: 407,
    image: <img alt='' src={lich} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 20,
  },
]

export const fecthMonster = (battlesWon) => {
  let id = battlesWon % 7

  let bonus_attack = 0;
  let bonus_health = 0;

  bonus_attack += Math.floor(battlesWon / 7) * 2
  bonus_health += Math.floor(battlesWon / 7) * 10

  let monster = { ...MONSTER_LIST[id] }

  monster.attack += bonus_attack;
  monster.health += bonus_health

  return monster
}

export const fetchZoneName = (battlesWon) => {
  if (battlesWon < 7) {
    return 'Twilight Zone'
  }

  if (battlesWon < 14) {
    return 'Dark Zone'
  }

  return 'The Abyss'
}

export const fetchIntroduction = (battlesWon) => {
  switch (battlesWon % 7) {
    case 0:
      return {
        name: 'Minotaur',
        image: <img alt='' src={minotaur} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Super Rage</Typography>
          </Box>

          <Typography mt={0.5}>Gains +2 attack each round.</Typography>
        </Box>
      }
    case 1:
      return {
        name: 'Troll',
        image: <img alt='' src={troll} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Regeneration</Typography>
          </Box>
          <Typography mt={0.5}>Restores (4) health each turn.</Typography>
        </Box>
      }
    case 2:
      return {
        name: 'Bigfoot',
        image: <img alt='' src={bigfoot} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Thick Skin</Typography>
          </Box>
          <Typography mt={0.5}>Takes (1) less damage from all sources.</Typography>
        </Box>
      }
    case 3:
      return {
        name: 'Chimera',
        image: <img alt='' src={chimera} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Intimidation</Typography>
          </Box>
          <Typography mt={0.5}>Creatures can't attack the same turn they're summoned.</Typography>
        </Box>
      }
    case 4:
      return {
        name: 'Kappa',
        image: <img alt='' src={kappa} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Mind Vision</Typography>
          </Box>
          <Typography mt={0.5}>Creatures cost (1) more.</Typography>
        </Box>
      }
    case 5:
      return {
        name: 'Spider',
        image: <img alt='' src={spider} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Poison Spray</Typography>
          </Box>
          <Typography mt={0.5}>Deals (2) damage to each creature.</Typography>
        </Box>
      }
    case 6:
      return {
        name: 'Lich',
        image: <img alt='' src={lich} height={'60%'} />,
        abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', p: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography color="primary" variant='h6'>Abilities</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Rage</Typography>
          </Box>
          <Typography mt={0.5}>Gains +1 attack each round.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography color="primary">★ Drain Life</Typography>
          </Box>
          <Typography mt={0.5}>Drains (1) life from each character.</Typography>
        </Box>
      }
    default:
      return {}
  }
}