import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { getLeaderboard } from '../../api/indexer';
import { hexToAscii } from '@dojoengine/utils';

function Leaderboard() {
  const [value, setValue] = useState('one');
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      const data = await getLeaderboard(page)
      console.log(data)
      setLeaderboard(data || [])
    }

    fetchLeaderboard()
  }, [])

  return (
    <Box sx={styles.container}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant='fullWidth'
      >
        <Tab value="one" label="Leaderboard" />
      </Tabs>

      <Box sx={styles.header}>
        <Box width='50px' textAlign={'center'}>
          <Typography>Rank</Typography>
        </Box>

        <Box width='250px'>
          <Typography>Player</Typography>
        </Box>

        <Box width='100px' textAlign={'center'}>
          <Typography>Score</Typography>
        </Box>
      </Box>

      {React.Children.toArray(
        leaderboard.map((player, i) => {
          return <Box sx={styles.row}>
            <Box width='50px' textAlign={'center'}>
              <Typography>{page * 10 + i + 1}</Typography>
            </Box>

            <Box width='250px'>
              <Typography>{hexToAscii(player.player_name)}</Typography>
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