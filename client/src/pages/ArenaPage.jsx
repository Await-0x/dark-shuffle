import { Box } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { getActiveGame, getTreeNodes } from '../api/indexer'
import ReconnectDialog from '../components/dialogs/reconnecting'
import StartDraft from '../components/landing/startDraft'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import StartBattleContainer from '../container/StartBattleContainer'
import { BattleContext } from '../contexts/battleContext'
import { DraftContext } from '../contexts/draftContext'
import { GameContext } from '../contexts/gameContext'
import { useSnackbar } from 'notistack'
import { Scrollbars } from 'react-custom-scrollbars';

function ArenaPage() {
  const gameState = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { gameId, inDraft, inBattle } = gameState.values

  const [reconnecting, setReconnecting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    async function checkActiveGame(address) {
      let data = await getActiveGame(address)

      if (data) {
        setReconnecting(true)

        try {
          await draft.fetchDraftCards(data.game_id, data.in_draft)
          let nodes = await getTreeNodes(data.game_id, data.branch)

          if (nodes) {
            gameState.setNodes(nodes)
          }

          if (data.in_battle) {
            await battle.utils.fetchBattleState(data.active_battle_id)
          }

          gameState.setGame({
            gameId: data.game_id,
            player: data.player,
            playerName: data.player_name,
            active: data.active,
            inDraft: data.in_draft,
            inBattle: data.in_battle,
            activeBattleId: data.active_battle_id,

            heroHealth: data.hero_health,
            heroEnergy: data.hero_energy,
            heroXp: data.hero_xp,

            branch: data.branch,
            nodeLevel: data.node_level,
            monstersSlain: data.monsters_slain,
            entropyCount: data.entropy_count
          })

          setReconnecting(false)
        } catch (ex) {
          console.log(ex)
          setReconnecting(false)
          enqueueSnackbar('Failed To Reconnect', { variant: 'warning' })
        }
      }
    }

    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))
      checkActiveGame(burner.address)
    }
  }, [])

  return (
    <Scrollbars style={{ ...styles.container }}>
      {gameId === null && <StartDraft />}

      {inDraft && <DraftContainer />}

      {inBattle && <BattleContainer />}

      {(gameId !== null && !inDraft && !inBattle) && <StartBattleContainer />}

      {reconnecting && <ReconnectDialog close={() => setReconnecting(false)} />}
    </Scrollbars>
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