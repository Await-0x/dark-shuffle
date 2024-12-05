import { hexToAscii } from '@dojoengine/utils'
import { useAccount } from '@starknet-react/core'
import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { getActiveGame, getGameEffects, getMap } from '../api/indexer'
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

  const { gameId, inDraft, inBattle } = gameState.values

  const [reconnecting, setReconnecting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const fetchGameState = async (data) => {
    setReconnecting(true)

    try {
      await draft.actions.fetchDraft(data.game_id)

      if (!data.in_draft) {
        let map = await getMap(data.game_id, data.map_level)

        if (map) {
          let computedMap = generateMapNodes(map.level, map.seed)

          gameState.setMap(computedMap.map(node => {
            return { ...node, active: node.parents.includes(data.last_node_id), status: node.nodeId === data.last_node_id ? 1 : 0 }
          }))
        }

        if (data.in_battle) {
          await battle.utils.fetchBattleState(data.active_battle_id)
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
        seasonId: data.season_id,
        gameId: data.game_id,
        player: data.player,
        player_name: hexToAscii(data.player_name),
        active: data.active,
        inDraft: data.in_draft,
        inBattle: data.in_battle,
        activeBattleId: data.active_battle_id,

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
        let data = await getActiveGame(address)

        if (data) {
          fetchGameState(data)
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