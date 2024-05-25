import { Box } from '@mui/material'
import React, { useContext } from 'react'
import StartDraft from '../components/draft/startDraft'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import { GameContext } from '../contexts/gameContext'
import StartBattleContainer from '../container/StartBattleContainer'
import { useEffect } from 'react'
import { getActiveGame } from '../api/indexer'

function ArenaPage() {
  const gameState = useContext(GameContext)
  const { gameId, inDraft, inBattle } = gameState.values

  useEffect(() => {
    async function checkActiveGame(address) {
      let data = await getActiveGame(address)
      if (data) { console.log('Active game!!') }
    }

    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))
      checkActiveGame(burner.address)
    }
  }, [])

  return (
    <Box sx={styles.container}>
      {gameId === null && <StartDraft />}

      {inDraft && <DraftContainer />}

      {inBattle && <BattleContainer />}

      {(gameId !== null && !inDraft && !inBattle) && <StartBattleContainer />}
    </Box >
  )
}

export default ArenaPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },

  board: {
    height: 'calc(100% - 200px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2
  },

  playerContainer: {
    height: '144px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },

  hand: {
    height: '100%',
    width: '800px',
  },

  manaContainer: {
    height: '100%',
    width: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pt: 2,
    gap: 1
  }
}