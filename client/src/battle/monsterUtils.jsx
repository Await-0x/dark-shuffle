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
    id: 1,
    monsterId: 1,
    name: 'Minotaur',
    image: <img alt='' src={minotaur} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Minotaur</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Super Rage</Typography>
      </Box>

      <Typography mt={0.5}>Gains +2 attack each round.</Typography>
    </>,
  },
  {
    id: 2,
    monsterId: 2,
    name: 'Troll',
    image: <img alt='' src={troll} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Troll</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Regeneration</Typography>
      </Box>
      <Typography mt={0.5}>Restores (4) health each turn.</Typography>
    </>,
  },
  {
    id: 3,
    monsterId: 3,
    name: 'Bigfoot',
    image: <img alt='' src={bigfoot} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Bigfoot</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Thick Skin</Typography>
      </Box>
      <Typography mt={0.5}>Takes (1) less damage from all sources.</Typography>
    </>
  },
  {
    id: 4,
    monsterId: 4,
    name: 'Chimera',
    image: <img alt='' src={chimera} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Chimera</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Intimidation</Typography>
      </Box>
      <Typography mt={0.5}>Creatures can't attack the same turn they're summoned.</Typography>
    </>
  },
  {
    id: 5,
    monsterId: 5,
    name: 'Kappa',
    image: <img alt='' src={kappa} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Kappa</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Mind Vision</Typography>
      </Box>
      <Typography mt={0.5}>Creatures cost (1) more.</Typography>
    </>,
  },
  {
    id: 6,
    monsterId: 6,
    name: 'Spider',
    image: <img alt='' src={spider} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Spider</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Poison Spray</Typography>
      </Box>
      <Typography mt={0.5}>Deals (2) damage to each creature.</Typography>
    </>,
  },
  {
    id: 7,
    monsterId: 7,
    name: 'Lich',
    image: <img alt='' src={lich} height={'100%'} />,
    abilities: <>
      <Typography color="primary" variant='h6'>Lich</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Drain Life</Typography>
      </Box>
      <Typography mt={0.5}>Drains (1) life from each character.</Typography>
    </>,
  },
]
