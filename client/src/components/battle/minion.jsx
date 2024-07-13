import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React from "react";
import sword from "../../assets/images/sword.png"

function Minion(props) {
  const { minion } = props

  return <Box sx={styles.container}>

    <Box sx={styles.imageContainer}>
      {minion.image}
    </Box>

    <Box sx={styles.bottomContainer}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6">
          {minion.att}
        </Typography>

        <img alt='' src={sword} height={24} width={24} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6">
          {minion.hp}
        </Typography>

        <FavoriteIcon htmlColor="red" />
      </Box>
    </Box>

  </Box>
}

export default Minion

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '120px',
    height: '120px',
    background: '#282729',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '65%'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}