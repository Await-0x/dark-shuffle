import { Box, Tab, Tabs, Typography, Pagination } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { getLeaderboard } from '../../api/indexer';
import { hexToAscii } from '@dojoengine/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { dojoConfig } from '../../../dojo.config';
import { isMobile } from 'react-device-detect';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('one')

  const changeLeaderboard = (event, newValue) => {
    setLoading(true)
    setPage(1);
    setTab(newValue);
  }

  const handleChange = (event, newValue) => {
    setLoading(true)
    setPage(newValue);
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)

      const data = await getLeaderboard(dojoConfig.seasonId, page - 1)

      setLeaderboard(data ?? [])
      setLoading(false)
    }

    fetchLeaderboard()
  }, [page, tab])



  return (
    <Box sx={styles.container}>
      <Tabs
        value={tab}
        indicatorColor="primary"
        onChange={changeLeaderboard}
      >
        <Tab value={'one'} label="Season" />

        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Pagination count={10} shape="rounded" color='primary' size='small' page={page} onChange={handleChange} />
        </Box>
      </Tabs>

      <Box sx={styles.header}>
        <Box width='50px' textAlign={'center'}>
          <Typography>Rank</Typography>
        </Box>

        <Box width={isMobile ? '150px' : '250px'}>
          <Typography>Player</Typography>
        </Box>

        <Box width='80px' textAlign={'center'}>
          <Typography>Score</Typography>
        </Box>
      </Box>

      {loading && <Box />}

      <Scrollbars style={{ width: '100%', paddingBottom: '20px', height: '220px' }}>
        {!loading && React.Children.toArray(
          leaderboard.map((player, i) => {
            return <>
              <Box sx={styles.row}>
                <Box width='50px' textAlign={'center'}>
                  <Typography>{(page - 1) * 10 + i + 1}</Typography>
                </Box>

                <Box width='250px'>
                  <Typography>{hexToAscii(player.player_name)}</Typography>
                </Box>

                <Box width='100px' textAlign={'center'}>
                  <Typography>{player.hero_xp}</Typography>
                </Box>
              </Box>
            </>
          })
        )}
      </Scrollbars>
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