import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React from "react";
import { fetch_image, types } from "../helpers/cards";
import sword from '../assets/images/sword.png'

function SmallCard(props) {
  const { card, showStats } = props

  return <Box sx={styles.container}>

    <Box sx={styles.header}>
      <Box sx={styles.circle} border={'1px solid #FFE97F'}>
        <Typography>
          {card.cost}
        </Typography>
      </Box>

      <Typography>
        {card.name}
      </Typography>
    </Box>

    <Box sx={styles.imageContainer}>
      <img alt='' src={fetch_image(card.name)} height={'100%'} />
    </Box>

    <Box sx={styles.bottomContainer}>
      {showStats &&
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">
              {card.attack}
            </Typography>

            <img alt='' src={sword} height={24} width={24} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">
              {card.health}
            </Typography>

            <FavoriteIcon htmlColor="red" />
          </Box>
        </>}

      {card.type === types.SPELL &&
        <Typography textAlign={'center'} width={'100%'} color='primary'>
          Spell
        </Typography>
      }
    </Box>

  </Box>
}

export default SmallCard

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    p: 1,
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '40%'
  },
  header: {
    display: 'flex',
    gap: 1,
    alignItems: 'center'
  },
  circle: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '63px',
    pb: 1,
    boxSizing: 'border-box'
  }
}