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
    name: 'Minotaur',
    image: <img alt='' src={minotaur} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Minotaur</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Super Rage</Typography>
      </Box>

      <Typography mt={0.5}>Gains +2 attack each round.</Typography>
    </Box>,
  },
  {
    id: 402,
    monsterId: 402,
    name: 'Troll',
    image: <img alt='' src={troll} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Troll</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Regeneration</Typography>
      </Box>
      <Typography mt={0.5}>Restores (4) health each turn.</Typography>
    </Box>,
  },
  {
    id: 403,
    monsterId: 403,
    name: 'Bigfoot',
    image: <img alt='' src={bigfoot} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Bigfoot</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Thick Skin</Typography>
      </Box>
      <Typography mt={0.5}>Takes (1) less damage from all sources.</Typography>
    </Box>
  },
  {
    id: 404,
    monsterId: 404,
    name: 'Chimera',
    image: <img alt='' src={chimera} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Chimera</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Intimidation</Typography>
      </Box>
      <Typography mt={0.5}>Creatures can't attack the same turn they're summoned.</Typography>
    </Box>
  },
  {
    id: 405,
    monsterId: 405,
    name: 'Kappa',
    image: <img alt='' src={kappa} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Kappa</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Mind Vision</Typography>
      </Box>
      <Typography mt={0.5}>Creatures cost (1) more.</Typography>
    </Box>,
  },
  {
    id: 406,
    monsterId: 406,
    name: 'Spider',
    image: <img alt='' src={spider} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Spider</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Poison Spray</Typography>
      </Box>
      <Typography mt={0.5}>Deals (2) damage to each creature.</Typography>
    </Box>,
  },
  {
    id: 407,
    monsterId: 407,
    name: 'Lich',
    image: <img alt='' src={lich} height={'100%'} />,
    abilities: <Box width={'180px'} textAlign={'left'} sx={{ background: '#141920', py: 1, px: 2, borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <Typography color="primary" variant='h6'>Lich</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Drain Life</Typography>
      </Box>
      <Typography mt={0.5}>Drains (1) life from each character.</Typography>
    </Box>,
  },
]
