import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { GameContext } from "../../contexts/gameContext";

function HeroStats(props) {
  const game = useContext(GameContext)

  if (props.compact) {
    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box display={'flex'}>
        <Typography>
          {game.values.heroHealth}
        </Typography>

        <FavoriteIcon htmlColor="red" sx={{ fontSize: '18px' }} />
      </Box>
    </Box>
  }

  return <Box sx={styles.container}>

    <Box display={'flex'} justifyContent={'space-between'}>
      <Typography color={'primary'} sx={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {game.values.player_name}
      </Typography>

      <Typography color='primary' sx={{ fontSize: '13px' }}>
        {game.values.monstersSlain} XP
      </Typography>
    </Box>

    <Box mt={1} display={'flex'} justifyContent={'space-between'}>
      <Typography>
        Health left
      </Typography>

      <Box display={'flex'}>
        <Typography>
          {game.values.heroHealth}
        </Typography>

        <FavoriteIcon htmlColor="red" sx={{ fontSize: '18px' }} />
      </Box>
    </Box>

    {/* <Box mt={4} display={'flex'} flexDirection={'column'} gap={'1px'}>
      <Typography color={'#ffb260'} mb={0.5}>
        Effects
      </Typography>
      <Typography sx={{ fontSize: '13px' }} color={'#ffb260'}>
        - Creatures have +1 attack
      </Typography>

      <Typography sx={{ fontSize: '13px' }} color={'#ffb260'}>
        - Start battle with +1 energy
      </Typography>
    </Box> */}

  </Box>
}

export default HeroStats

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    m: 1,
    mb: 0,
    py: 1,
    px: 1.5,
    boxSizing: 'border-box',
    width: 'calc(100% - 16px)',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
  },
}