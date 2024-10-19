import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { getActiveGame, getEntropy, getTreeNodes } from '../api/indexer'
import ReconnectDialog from '../components/dialogs/reconnecting'
import StartDraft from '../components/landing/startDraft'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import StartBattleContainer from '../container/StartBattleContainer'
import { BattleContext } from '../contexts/battleContext'
import { DraftContext } from '../contexts/draftContext'
import { GameContext } from '../contexts/gameContext'
import { hexToAscii } from '@dojoengine/utils'
import { useAccount } from '@starknet-react/core'

function ArenaPage() {
  const { address } = useAccount()
  const gameState = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { gameId, inDraft, inBattle } = gameState.values

  const [reconnecting, setReconnecting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const fetchGameState = async (data, demo) => {
    setReconnecting(true)

    try {
      const entropy = await getEntropy(data.game_id, data.entropy_count, demo)

      gameState.setGameEntropy({
        blockNumber: parseInt(entropy.block_number)
      })

      await draft.fetchDraftCards(data.game_id, data.in_draft, demo)
      let nodes = await getTreeNodes(data.game_id, data.branch, demo)

      if (nodes) {
        gameState.setNodes(nodes)
      }

      if (data.in_battle) {
        await battle.utils.fetchBattleState(data.active_battle_id, demo)
      }

      gameState.setGame({
        isDemo: demo,
        seasonId: data.season_id,
        gameId: data.game_id,
        player: data.player,
        player_name: hexToAscii(data.player_name),
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


  useEffect(() => {
    async function checkActiveGame() {
      if (address) {
        let data = await getActiveGame(address)
        if (data) {
          fetchGameState(data)
        } else if (localStorage.getItem('burner')) {
          let demoData = await getActiveGame(JSON.parse(localStorage.getItem('burner')).address, true)

          if (demoData) {
            fetchGameState(demoData, true)
          }
        }
      }
    }

    checkActiveGame()
  }, [address])

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
  }
}