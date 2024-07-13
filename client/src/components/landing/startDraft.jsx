import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { DraftContext } from '../../contexts/draftContext'
import { _styles } from '../../helpers/styles'
import TestNet from '../header/testnet'
import Leaderboard from './leaderboard'
import Monsters from './monsters'

function StartDraft() {
  const draft = useContext(DraftContext)
  const [loading, setLoading] = useState(false)

  const [nameDialog, showNameDialog] = useState(false)

  async function beginDraft() {
    if (!draft.playerName) {
      return showNameDialog(true)
    }

    setLoading(true)

    await draft.startDraft()

    setLoading(false)
  }

  return (
    <Box sx={styles.container}>

      <Box width={'100%'} display={'flex'} justifyContent={'space-between'} gap={2}>
        <Box>
          <Typography variant='h5' color='primary' mb={1}>
            Season Of Discovery
          </Typography>
          <Typography>
            New deck-building game coming to starknet, powered by Realms L3 and $Lords. <br />
            Your feedback and in-game decisions will be instrumental in refining and balancing the game.
          </Typography>
        </Box>

        <Box display='flex' gap={2}>
          <Box sx={[styles.kpi]}>
            <Typography>
              Season ends in
            </Typography>
            <Typography variant='h6' color='primary'>
              0 Blocks
            </Typography>
          </Box>

          <Box sx={styles.kpi}>
            <Typography>
              Season reward
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
          <Typography variant='h2'>
            Enter the Cave
          </Typography>

          <Typography color={'primary'} mt={4}>
            Assemble a team of mighty creatures and mystical spells, each with their unique abilities and powers.
          </Typography>

          <Typography color={'primary'} mt={1.5}>
            Venture into the perilous depths of the cave, a treacherous place teeming with monstrous adversaries and enigmatic challenges.

            With every step and every battle, your strategic prowess and the synergies of your team will be put to the test.
          </Typography>

          <Typography color={'primary'} mt={1.5}>
            But tread carefully, brave adventurer, for the cave shows no mercy. A single defeat, a mere moment of weakness, spells the end of your journey. In this high-stakes adventure, death is final, and glory is earned.
          </Typography>

          <Typography color={'primary'} mt={1.5}>
            Do you have the courage and wit to navigate the trials of the cave, overcoming its monstrous denizens and uncovering its ancient secrets? Assemble your cards, ready your team, and step forth into the unknown.
          </Typography>

          <Box mt={4} display={'flex'} alignItems={'center'} gap={2}>
            <LoadingButton variant='outlined' loading={loading} onClick={() => beginDraft()} sx={{ fontSize: '20px', letterSpacing: '2px', textTransform: 'none' }}>
              Start draft
            </LoadingButton>
          </Box>
        </Box>

        <Box width={'450px'} sx={_styles.customBox}>

          <Leaderboard />

        </Box>

      </Box>

      {nameDialog && <TestNet open={nameDialog} close={() => { showNameDialog(false); beginDraft(); }} />}
    </Box >
  )
}

export default StartDraft

const styles = {
  container: {
    width: '100%',
    height: 'calc(100% - 55px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    gap: 6,
    p: 4,
  },
  startContainer: {
    width: '100%'
  },
  kpi: {
    width: '250px',
    height: '90px',
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    p: 2
  }
}