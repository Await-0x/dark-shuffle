import { Box, Button, Dialog, Typography, Pagination, CircularProgress } from '@mui/material';
import { motion } from "framer-motion";
import { fadeVariant } from "../../helpers/variants";
import logo from '../../assets/images/logo.svg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';
import { fetchDarkShuffleGameTokens } from '../../api/starknet';
import { useEffect } from 'react';

function GameTokens(props) {
  const { open, close, address, resumeGame, startGame } = props

  const [games, setGames] = useState([])
  const [selectedGames, setSelectedGames] = useState([])

  const [page, setPage] = useState(1)
  const [active, showActive] = useState(true)
  const [loading, setLoading] = useState(true)

  const handleChange = (event, newValue) => {
    setLoading(true)
    setPage(newValue);
  };

  useEffect(() => {
    async function fetchGames() {
      setLoading(true)

      const data = await fetchDarkShuffleGameTokens(address, 5, page - 1, Number(active))

      setSelectedGames([])
      setGames(data ?? [])
      setLoading(false)
    }

    fetchGames()
  }, [page, address, active])

  useEffect(() => {
    setPage(1)
  }, [active])

  const selectGame = (id) => {
    setSelectedGames([id])
  }

  const handleResumeGame = (game_id) => {
    let game = games.find(game => game.id === game_id)

    if (game.xp) {
      resumeGame(game_id)
    } else {
      startGame(game.season, game_id)
    }

    close(false)
  }

  function renderGame(game) {
    return <Box sx={[styles.gameContainer, { opacity: selectedGames.includes(game.id) ? 1 : 0.8 }]}
      border={selectedGames.includes(game.id) ? '1px solid #f59100' : '1px solid rgba(255, 255, 255, 0.3)'}
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

            <Typography color='primary' variant='h3' textAlign={'center'}>
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

                <Pagination count={1000} siblingCount={0} boundaryCount={0} hideNextButton={games.length < 5} shape="rounded" color='primary' size='small' page={page} onChange={handleChange} />
              </Box>

              {loading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                <CircularProgress />
              </Box>}

              {!loading && React.Children.toArray(
                games.map(game => renderGame(game))
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant='outlined' size='large'
                disabled={selectedGames.length !== 1 || games.find(game => game.id === selectedGames[0])?.state === 3}
                onClick={() => handleResumeGame(selectedGames[0])}
              >
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
    py: 2,
    px: 3,
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
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '2px',
    py: '6px',
    pr: 1,
    gap: 1,
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  gamesContainer: {
    width: '360px',
    maxWidth: '100%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mt: 1
  },
}