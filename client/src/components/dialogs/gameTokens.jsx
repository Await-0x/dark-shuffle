import { Box, Button, Dialog, Typography, Pagination } from '@mui/material';
import { motion } from "framer-motion";
import { fadeVariant } from "../../helpers/variants";
import logo from '../../assets/images/logo.svg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';

function GameTokens(props) {
  const { open, close } = props
  const [selectedGames, setSelectedGames] = useState([])
  const [page, setPage] = useState(1)
  const [active, showActive] = useState(true)
  const [loading, setLoading] = useState()

  const handleChange = (event, newValue) => {
    setLoading(true)
    setPage(newValue);
  };

  const test_games = [
    {
      id: 1,
      name: 'Await',
      xp: 1,
      hp: 50,
      season: true,
    },
    {
      id: 2,
      name: 'Await',
      xp: 1,
      hp: 50,
      season: true,
    },
    {
      id: 3,
      name: 'Await',
      xp: 1,
      hp: 50,
      season: true,
    },
    {
      id: 4,
      name: 'Await',
      xp: 1,
      hp: 50,
      season: true,
    },
    {
      id: 5,
      name: 'Await',
      xp: 1,
      hp: 50,
      season: true,
    },
  ]

  const selectGame = (id) => {
    if (selectedGames.includes(id)) {
      setSelectedGames(prev => prev.filter(_id => _id !== id))
    } else {
      setSelectedGames(prev => [...prev, id])
    }
  }

  function renderGame(game) {
    return <Box sx={[styles.gameContainer, { opacity: selectedGames.includes(game.id) ? 1 : 0.9 }]}
      border={selectedGames.includes(game.id) ? '1px solid #f59100' : '1px solid rgba(255, 255, 255, 0.4)'}
      onClick={() => selectGame(game.id)}
    >

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <img alt='' src={logo} height='42' />

        {game.xp ? <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography color='primary'>
            {game.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box display={'flex'}>
              <Typography>
                {game.hp}
              </Typography>

              <FavoriteIcon htmlColor="red" sx={{ fontSize: '18px' }} />
            </Box>

            <Typography color='primary' sx={{ fontSize: '13px' }}>
              {game.xp} XP
            </Typography>
          </Box>
        </Box>
          : <Box>
            <Typography color='primary'>
              New Game
            </Typography>
          </Box>
        }
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Typography color='primary'>
          #{game.id}
        </Typography>

        <Typography color='primary' sx={{ color: '#f59100' }}>
          {game.season ? 'Season' : ''}
        </Typography>
      </Box>
    </Box >
  }

  return (
    <Dialog
      open={open}
      onClose={() => close(false)}
      maxWidth={'lg'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 1)', border: '1px solid #FFE97F' }
      }}
    >
      <Box sx={styles.dialogContainer}>

        <motion.div variants={fadeVariant} exit='exit' animate='enter'>
          <Box sx={styles.container}>

            <Typography color='white' variant='h3'>
              Game Tokens
            </Typography>


            <Box sx={styles.gamesContainer}>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant='outlined' size='small' color={active ? 'primary' : 'secondary'} onClick={() => showActive(true)}>
                    Active
                  </Button>

                  <Button variant='outlined' size='small' color={!active ? 'primary' : 'secondary'} onClick={() => showActive(false)}>
                    Dead
                  </Button>
                </Box>

                <Pagination count={3} shape="rounded" color='primary' size='small' page={page} onChange={handleChange} />
              </Box>

              {React.Children.toArray(
                test_games.map(game => renderGame(game))
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button variant='outlined' size='large' color='secondary' disabled={selectedGames.length < 1}>
                Transfer
              </Button>

              <Button variant='outlined' size='large' disabled={selectedGames.length !== 1}>
                Start Game
              </Button>
            </Box>

          </Box>
        </motion.div>

      </Box>
    </Dialog>
  )
}

export default GameTokens

const styles = {
  dialogContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: 2,
    width: '100%',
    maxWidth: '500px',
    overflow: 'hidden'
  },
  container: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5
  },
  gameContainer: {
    width: '360px',
    maxWidth: '98vw',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '2px',
    py: '6px',
    pr: 1,
    gap: 1,
    cursor: 'pointer'
  },
  gamesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    mt: 0.5
  },
}