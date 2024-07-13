import { Box, Typography } from "@mui/material"
import React, { useContext } from "react"
import { GameContext } from "../../contexts/gameContext"
import FavoriteIcon from '@mui/icons-material/Favorite';
import bolt from "../../assets/images/bolt.png";

function HeroStats() {
  const game = useContext(GameContext)

  return <Box sx={styles.container}>

    <Box display={'flex'} justifyContent={'space-between'}>
      <Typography color={'primary'} sx={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {game.values.name}
      </Typography>

      <Typography color='primary' sx={{ fontSize: '13px' }}>
        99999 XP
      </Typography>
    </Box>

    <Box mt={1} display={'flex'} justifyContent={'space-between'}>
      <Typography>
        Health
      </Typography>

      <Box display={'flex'}>
        <Typography>
          {game.values.heroHealth}
        </Typography>

        <FavoriteIcon htmlColor="red" sx={{ fontSize: '18px' }} />
      </Box>
    </Box>

    <Box mt={0.5} display={'flex'} justifyContent={'space-between'}>
      <Typography>
        Energy
      </Typography>

      <Box display={'flex'}>
        <Typography>
          {game.values.heroEnergy}
        </Typography>

        <img alt='' src={bolt} height={18} />
      </Box>
    </Box>

    <Box mt={4} display={'flex'} flexDirection={'column'} gap={'1px'}>
      <Typography color={'#ffb260'} mb={0.5}>
        Effects
      </Typography>
      <Typography sx={{ fontSize: '13px' }} color={'#ffb260'}>
        - Creatures have +1 attack
      </Typography>

      <Typography sx={{ fontSize: '13px' }} color={'#ffb260'}>
        - Start battle with +1 energy
      </Typography>
    </Box>

  </Box>
}

export default HeroStats

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    m: 1,
    p: 2,
    boxSizing: 'border-box',
    width: '284px',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
  },
}