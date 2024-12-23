import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import logo from '../../assets/images/logo.svg'
import { DojoContext } from '../../contexts/dojoContext'
import { DraftContext } from '../../contexts/draftContext'
import { useSeason } from '../../contexts/seasonContext'
import { _styles } from '../../helpers/styles'
import { formatTimeUntil } from '../../helpers/utilities'
import Leaderboard from './leaderboard'
import Monsters from './monsters'
import StartGameDialog from '../dialogs/startGame'

function StartDraft() {
  const season = useSeason()
  const dojo = useContext(DojoContext)

  const draft = useContext(DraftContext)
  const { status } = draft.getState

  const [showWarnings, setShowWarnings] = useState(false)

  async function beginDraft(isSeason) {
    if (isSeason) {
      setShowWarnings(true)
    }

    await draft.actions.startDraft(isSeason)
  }

  const enoughFunds = dojo.balances.lords >= (season.values?.entryFee ?? 0)

  return (
    <>
      <MobileView>
        <Box sx={styles.mobileContainer}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h2' color='primary' fontSize={'30px'}>
              Dark Shu
            </Typography>

            <Box mb={'-19px'} ml={'-8px'} mr={'-7px'}>
              <img alt='' src={logo} height='42' />
            </Box>

            <Typography variant='h2' color='primary' fontSize={'30px'}>
              le
            </Typography>
          </Box>

          <Box sx={[styles.kpi, { width: '100%', height: '90px', mt: 1 }]}>
            <Typography variant='h6'>
              Season Pool
            </Typography>
            <Typography variant='h5' color='primary'>
              {Math.floor(season.values.rewardPool / 1e18)} $LORDS
            </Typography>

          </Box>

          <Box sx={[styles.kpi, { width: '100%', height: '90px', mb: 1 }]}>
            <Typography>
              {season.values.end > (Date.now() / 1000) ? `Season 0 ${season.values.start > (Date.now() / 1000) ? 'begins in' : 'ends in'}` : 'Season 0'}
            </Typography>
            <Typography variant='h5' color='primary'>
              {season.values.start > (Date.now() / 1000) ? `${formatTimeUntil(season.values.start)}` : (season.values.end > (Date.now() / 1000) ? `${formatTimeUntil(season.values.end)}` : 'Finished')}
            </Typography>
          </Box>

          <Typography variant='h3' textAlign={'center'}>
            Season 0: New beginnings
          </Typography>

          <LoadingButton variant='outlined' loading={status} onClick={() => beginDraft(true)} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
            Play Season
          </LoadingButton>

          <LoadingButton color='secondary' variant='outlined' loading={status} onClick={() => beginDraft(false)} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
            Play Demo
          </LoadingButton>

          <Box width={'100%'} sx={_styles.customBox} mt={1}>

            <Leaderboard />

          </Box>
        </Box>
      </MobileView>

      <BrowserView>
        <Box sx={styles.browserContainer}>

          <Box width={'100%'} display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'} gap={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='h2' color='primary' fontSize={'30px'}>
                  Dark Shu
                </Typography>

                <Box mb={'-19px'} ml={'-8px'} mr={'-7px'}>
                  <img alt='' src={logo} height='42' />
                </Box>

                <Typography variant='h2' color='primary' fontSize={'30px'}>
                  le
                </Typography>
              </Box>

              <Typography variant='h6'>
                A Provable Roguelike Deck-building Game on Starknet, powered by $LORDS.
              </Typography>
            </Box>

            <Box display='flex' gap={2}>
              <Box sx={[styles.kpi]}>
                <Typography>
                  {season.values.end > (Date.now() / 1000) ? `Season 0 ${season.values.start > (Date.now() / 1000) ? 'begins in' : 'ends in'}` : 'Season 0'}
                </Typography>
                <Typography variant='h5' color='primary'>
                  {season.values.start > (Date.now() / 1000) ? `${formatTimeUntil(season.values.start)}` : (season.values.end > (Date.now() / 1000) ? `${formatTimeUntil(season.values.end)}` : 'Finished')}
                </Typography>
              </Box>

              <Box sx={styles.kpi}>
                <Typography>
                  Season Entry
                </Typography>
                <Typography variant={'h5'} color='primary'>
                  {Math.floor(season.values.entryFee / 1e18)} $LORDS
                </Typography>
              </Box>

              <Box sx={styles.kpi}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography>
                    Season Pool
                  </Typography>
                </Box>
                <Typography variant={'h5'} color='primary'>
                  {Math.floor(season.values.rewardPool / 1e18)} $LORDS
                </Typography>
              </Box>
            </Box>
          </Box>

          <Monsters />

          <Box sx={[_styles.customBox, _styles.linearBg, { display: 'flex', justifyContent: 'space-between', p: 2 }]} width={'100%'}>

            <Box sx={{ maxWidth: '800px' }}>
              <Typography variant='h3'>
                Season 0: New beginnings
              </Typography>

              <ul style={{ paddingLeft: '16px', color: '#FFE97F' }}>
                <li>
                  <Typography mt={3} style={{ fontSize: '15px' }} color={'primary'}>
                    Draft 20 powerful cards to kickstart your journey, shaping your strategy from the very beginning.
                  </Typography>
                </li>

                <li>
                  <Typography mt={2} style={{ fontSize: '15px' }} color={'primary'}>
                    Explore randomly generated maps filled with branching paths and unpredictable challenges.
                  </Typography>
                </li>

                <li>
                  <Typography mt={2} style={{ fontSize: '15px' }} color={'primary'}>
                    Engage in strategic card-based battles against fierce beasts.
                  </Typography>
                </li>

                <li>
                  <Typography mt={2} style={{ fontSize: '15px' }} color={'primary'}>
                    Climb the leaderboard to earn a share of the season reward pool and prove your mastery.
                  </Typography>
                </li>
              </ul>

              <Box mt={4} display={'flex'} alignItems={'center'} gap={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: 'center' }}>
                  <LoadingButton variant='outlined' loading={status} onClick={() => beginDraft(true)} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
                    Play Season
                  </LoadingButton>

                  {(dojo.address && !enoughFunds && showWarnings) && <Typography textAlign={'center'} sx={{ fontSize: '14px', color: 'red', mb: '-21px' }}>
                    Not Enough LORDS!
                  </Typography>}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: 'center' }}>
                  <LoadingButton color='secondary' variant='outlined' loading={status}
                    onClick={() => beginDraft(false)} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
                    Play Demo
                  </LoadingButton>
                </Box>
              </Box>
            </Box>

            <Box width={'500px'} sx={_styles.customBox}>

              <Leaderboard />

            </Box>

          </Box>

        </Box >
      </BrowserView>

      {status && <StartGameDialog status={status} />}
    </>
  )
}

export default StartDraft

const styles = {
  mobileContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    gap: 2,
    p: 2
  },
  browserContainer: {
    width: '100%',
    height: 'calc(100% - 55px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    gap: 3.5,
    p: 4,
    px: 2,
    pt: 2
  },
  startContainer: {
    maxWidth: 'calc(100% - 500px)',
    width: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  seasonContainer: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  kpi: {
    width: '220px',
    height: '90px',
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    p: 2
  }
}