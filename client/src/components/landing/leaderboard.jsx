import { Box, Tab, Tabs, Typography, Pagination } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { getLeaderboard } from '../../api/indexer';
import { hexToAscii } from '@dojoengine/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { dojoConfig } from '../../../dojo.config';
import { isMobile } from 'react-device-detect';
import { formatNumber } from '../../helpers/utilities';
import { useSeason } from "../../contexts/seasonContext";

function Leaderboard() {
  const season = useSeason()
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

  const seasonPool = Math.floor(season.values.rewardPool / 1e18)
  const prizeDistribution = [0.35, 0.20, 0.15, 0.10, 0.08, 0.02, 0.02, 0.02, 0.02, 0.02]

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
        <Box width='55px' textAlign={'center'}></Box>
      </Box>

      {loading && <Box />}

      <Scrollbars style={{ width: '100%', paddingBottom: '20px', height: '220px' }}>
        {!loading && React.Children.toArray(
          leaderboard.map((player, i) => {
            let rank = (page - 1) * 10 + i + 1
            let prize = prizeDistribution[i]
            return <>
              <Box sx={styles.row}>
                <Box width='50px' textAlign={'center'}>
                  <Typography>{rank}</Typography>
                </Box>

                <Box width={isMobile ? '150px' : '250px'}>
                  <Typography>{hexToAscii(player.player_name)}</Typography>
                </Box>

                <Box width='80px' textAlign={'center'}>
                  <Typography>{player.hero_xp}</Typography>
                </Box>

                <Box width='55px' display={'flex'} gap={0.5} alignItems={'center'}>
                  {rank < 11 && <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FFE97F" height={12}><path d="M0 12v2h1v2h6V4h2v12h6v-2h1v-2h-2v2h-3V4h2V0h-2v2H9V0H7v2H5V0H3v4h2v10H2v-2z"></path></svg>
                    <Typography color={'primary'} sx={{ fontSize: '12px' }}>
                      {formatNumber(seasonPool * prizeDistribution[i])}
                    </Typography>
                  </>}
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