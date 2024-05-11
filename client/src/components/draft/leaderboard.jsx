import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

const players = [
  {
    rank: 1,
    name: 'feeble.stark',
    score: 16
  },
  {
    rank: 2,
    name: 'feeble.stark',
    score: 15
  },
  {
    rank: 3,
    name: 'feeble.stark',
    score: 14
  },
  {
    rank: 4,
    name: 'feeble.stark',
    score: 13
  },
  {
    rank: 5,
    name: 'feeble.stark',
    score: 13
  },
  {
    rank: 6,
    name: 'feeble.stark',
    score: 13
  },
  {
    rank: 7,
    name: 'feeble.stark',
    score: 13
  },
  {
    rank: 8,
    name: 'feeble.stark',
    score: 13
  }
]

function Leaderboard() {
  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={styles.container}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant='fullWidth'
      >
        <Tab value="one" label="Players" />
        <Tab value="two" label="Monsters" />
      </Tabs>

      <Box sx={styles.header}>
        <Box width='50px' textAlign={'center'}>
          <Typography>Rank</Typography>
        </Box>

        <Box width='250px'>
          <Typography>Player</Typography>
        </Box>

        <Box width='100px' textAlign={'center'}>
          <Typography>Top Streak</Typography>
        </Box>
      </Box>

      {React.Children.toArray(
        players.map(player => {
          return <Box sx={styles.row}>
            <Box width='50px' textAlign={'center'}>
              <Typography>{player.rank}</Typography>
            </Box>

            <Box width='250px'>
              <Typography>{player.name}</Typography>
            </Box>

            <Box width='100px' textAlign={'center'}>
              <Typography>{player.score}</Typography>
            </Box>
          </Box>
        })
      )}

    </Box >
  )
}

export default Leaderboard

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    p: 1,
    my: 1,
    opacity: 0.9
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    p: 1,
    opacity: 0.9
  }
}