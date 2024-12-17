import { hexToAscii } from '@dojoengine/utils'
import { useAccount } from '@starknet-react/core'
import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { getActiveGame, getActiveGameIds, getGameEffects, getMap } from '../api/indexer'
import ReconnectDialog from '../components/dialogs/reconnecting'
import StartDraft from '../components/landing/startDraft'
import BattleContainer from '../container/BattleContainer'
import DraftContainer from '../container/DraftContainer'
import StartBattleContainer from '../container/StartBattleContainer'
import { BattleContext } from '../contexts/battleContext'
import { DraftContext } from '../contexts/draftContext'
import { GameContext } from '../contexts/gameContext'
import { generateMapNodes } from '../helpers/map'

function ArenaPage() {
  const { address } = useAccount()
  const gameState = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { gameId, state } = gameState.values

  const [reconnecting, setReconnecting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const fetchGameState = async (data) => {
    setReconnecting(true)

    try {
      await draft.actions.fetchDraft(data.game_id)

      if (data.state !== 'Draft') {
        let map = await getMap(data.game_id, data.map_level)

        if (map) {
          let computedMap = generateMapNodes(map.level, map.seed)

          gameState.setMap(computedMap.map(node => {
            return {
              ...node,
              active: node.parents.includes(data.last_node_id),
              status: node.nodeId === data.last_node_id ? 1 : 0
            }
          }))
        }

        if (data.state === 'Battle') {
          await battle.utils.fetchBattleState(data.monsters_slain + 1, data.game_id)
        }

        const effects = await getGameEffects(data.game_id)
        if (effects) {
          gameState.setGameEffects({
            firstAttack: effects.first_attack,
            firstHealth: effects.first_health,
            firstCost: effects.first_cost,
            allAttack: effects.all_attack,
            hunterAttack: effects.hunter_attack,
            hunterHealth: effects.hunter_health,
            magicalAttack: effects.magical_attack,
            magicalHealth: effects.magical_health,
            bruteAttack: effects.brute_attack,
            bruteHealth: effects.brute_health,
            heroDmgReduction: effects.hero_dmg_reduction,
            heroCardHeal: effects.hero_card_heal,
            cardDraw: effects.card_draw,
            playCreatureHeal: effects.play_creature_heal,
            startBonusEnergy: effects.start_bonus_energy
          })
        }
      }

      gameState.setGame({
        gameId: data.game_id,
        seasonId: data.season_id,
        player_name: hexToAscii(data.player_name),
        state: data.state,

        heroHealth: data.hero_health,
        heroXp: data.hero_xp,
        monstersSlain: data.monsters_slain,

        mapLevel: data.map_level,
        mapDepth: data.map_depth,
        lastNodeId: data.last_node_id,
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
        let gameIds = await getActiveGameIds(address)
        let data = await getActiveGame(parseInt(gameIds[0], 16))

        if (data) {
          data.game_id = parseInt(data.game_id, 16)
          fetchGameState(data)
        }
      }
    }

    checkActiveGame()
  }, [address])

  return (
    <Scrollbars style={{ ...styles.container }}>
      {gameId === null && <StartDraft />}

      {state === 'Draft' && <DraftContainer />}

      {state === 'Battle' && <BattleContainer />}

      {state === 'Map' && <StartBattleContainer />}

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