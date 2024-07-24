import { Box } from '@mui/material'
import React, { useContext, useState } from 'react'
import StartDraft from '../components/landing/startDraft'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import { GameContext } from '../contexts/gameContext'
import StartBattleContainer from '../container/StartBattleContainer'
import { useEffect } from 'react'
import { getActiveGame, getGameEffects } from '../api/indexer'
import { DraftContext } from '../contexts/draftContext'
import { BattleContext } from '../contexts/battleContext'
import ReconnectDialog from '../components/dialogs/reconnecting'

function ArenaPage() {
  const gameState = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { gameId, inDraft, inBattle } = gameState.values

  const [reconnecting, setReconnecting] = useState(false)

  useEffect(() => {
    async function checkActiveGame(address) {
      let data = await getActiveGame(address)
      if (data) {
        setReconnecting(true)

        await draft.fetchDraftCards(data.game_id, data.in_draft)

        if (data.in_battle) {
          await battle.utils.fetchBattleState(data.active_battle_id)
        }

        gameState.setGame({
          gameId: data.game_id,
          player: data.player,
          active: data.active,
          inDraft: data.in_draft,
          inBattle: data.in_battle,
          activeBattleId: data.active_battle_id,
          heroHealth: data.hero_health,
          heroEnergy: data.hero_energy,
        })

        let gameEffects = await getGameEffects(data.game_id);

        gameState.setGameEffects({
          cardsDiscarded: gameEffects?.cards_discarded || 0,
          creaturesPlayed: gameEffects?.creatures_played || 0,
          spellsPlayed: gameEffects?.spells_played || 0,
          demonsPlayed: gameEffects?.demons_played || 0,
          nextSpellReduction: gameEffects?.next_spell_reduction || 0,
          deadCreatures: gameEffects?.dead_creatures || 0
        })

        setReconnecting(false)
      }
    }

    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))
      checkActiveGame(burner.address)
    }
  }, [])

  return (
    <Box sx={styles.container}>
      <StartBattleContainer />
    </Box>
  )

  return (
    <Box sx={styles.container}>
      {gameId === null && <StartDraft />}

      {inDraft && <DraftContainer />}

      {inBattle && <BattleContainer />}

      {(gameId !== null && !inDraft && !inBattle) && <StartBattleContainer />}

      {reconnecting && <ReconnectDialog />}
    </Box>
  )
}

export default ArenaPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    overflow: 'scroll'
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