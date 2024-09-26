import { LoadingButton } from '@mui/lab'
import { Box, List, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { DraftContext } from '../../contexts/draftContext'
import { _styles } from '../../helpers/styles'
import ChooseName from '../dialogs/chooseName'
import Leaderboard from './leaderboard'
import Monsters from './monsters'
import logo from '../../assets/images/logo.svg';
import { GameContext } from '../../contexts/gameContext'

function StartDraft() {
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)

  const [loading, setLoading] = useState(false)

  const [nameDialog, showNameDialog] = useState(false)

  async function beginDraft(isDemo) {
    game.setGame({ isDemo })

    if (!draft.playerName) {
      return showNameDialog(true)
    }

    setLoading(true)

    await draft.startDraft(isDemo)

    setLoading(false)
  }

  return (
    <>
      <MobileView>
        <Box sx={styles.mobileContainer}>
          <Box sx={[styles.kpi, { width: '100%', height: '110px', mt: 2 }]}>
            <Typography variant='h6'>
              Season reward
            </Typography>
            <Typography variant='h5' color='primary'>
              0 $LORDS
            </Typography>

          </Box>

          <Box sx={[styles.kpi, { width: '100%', height: '110px', mb: 2 }]}>
            <Typography variant='h6'>
              Season ends in
            </Typography>
            <Typography variant='h5' color='primary'>
              0 Blocks
            </Typography>
          </Box>

          <Typography variant='h2'>
            Enter the Cave
          </Typography>

          <Typography color={'primary'}>
            Do you have the courage and wit to navigate the trials of the cave, overcoming its monstrous denizens and uncovering its ancient secrets? Assemble your cards, ready your team, and step forth into the unknown.
          </Typography>

          <LoadingButton variant='outlined' loading={loading} onClick={() => beginDraft()} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
            Start draft
          </LoadingButton>

          <Box width={'100%'} sx={_styles.customBox} mt={2}>

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
                  Season 0
                </Typography>
                <Typography variant='h6' color='primary'>
                  Coming Soon
                </Typography>
              </Box>

              <Box sx={styles.kpi}>
                <Typography>
                  Season Entry
                </Typography>
                <Typography variant='h6' color='primary'>
                  0 $LORDS
                </Typography>
              </Box>

              <Box sx={styles.kpi}>
                <Typography>
                  Season Pool
                </Typography>
                <Typography variant='h6' color='primary'>
                  0 $LORDS
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
                    Draft 8 powerful cards to kickstart your journey, shaping your strategy from the very beginning.
                  </Typography>
                </li>

                <li>
                  <Typography mt={2} style={{ fontSize: '15px' }} color={'primary'}>
                    Explore randomly generated maps filled with branching paths and unpredictable challenges.
                  </Typography>
                </li>

                <li>
                  <Typography mt={2} style={{ fontSize: '15px' }} color={'primary'}>
                    Engage in strategic card-based battles against fierce beasts, earning experience to level up your deck and strengthen your abilities with each victory.
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
                  <LoadingButton disabled={true} variant='outlined' loading={loading} onClick={() => beginDraft()} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
                    Play Season
                  </LoadingButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: 'center' }}>
                  <LoadingButton color='secondary' variant='outlined' loading={loading} onClick={() => beginDraft(true)} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
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

      {nameDialog && <ChooseName open={nameDialog} close={() => { showNameDialog(false); beginDraft(game.values.isDemo); }} />}
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
    mt: 1,
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
    pl: 2,
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