import { useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';
import { attackEffect } from "../battle/attackUtils";
import { deathEffect } from "../battle/deathUtils";
import { GET_MONSTER } from "../battle/monsterUtils";
import { endOfTurnMonsterEffect } from "../battle/phaseUtils";
import { summonEffect } from "../battle/summonUtils";
import { CARD_DETAILS, tags } from "../helpers/cards";
import { ADVENTURER_ID } from "../helpers/constants";
import { delay } from "../helpers/utilities";
import { AnimationContext } from "./animationHandler";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";

export const BattleContext = createContext()

export const BattleProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const animationHandler = useContext(AnimationContext)

  const { enqueueSnackbar } = useSnackbar()
  const [resettingState, setResettingState] = useState(false)

  const [values, setValues] = useState({})
  const [updatedValues, setUpdatedValues] = useState()
  const [updatedBoard, setUpdatedBoard] = useState()

  const [hand, setHand] = useState([])
  const [board, setBoard] = useState([])
  const [battleEffects, setBattleEffects] = useState()
  const [actions, setActions] = useState([])

  const [endTurnEventOrder, setEndTurnEventOrder] = useState([])

  const [pendingTx, setPendingTx] = useState(false)
  const [endState, setEndState] = useState()

  useEffect(() => {
    if (animationHandler.completed.length < 1) {
      return
    }

    const animation = animationHandler.completed[0]

    if (animation.type === 'monsterAbility') {
      monsterAttack()
    }

    if (animation.type === 'monsterAttack') {
      monsterAttackResult()
    }

    if (animation.type === 'creatureAttack') {
      creatureAttack(animation.creatureId)
    }

    if (animation.type === 'creatureDead') {
      creatureDeath(animation.creature)
    }

    animationHandler.consumeCompleted()
    // eslint-ignore-next-line react-hooks/exhaustive-deps
  }, [animationHandler.completed])

  useEffect(() => {
    if (endTurnEventOrder.length > 0) {
      const event = endTurnEventOrder[0]

      if (event.type === 'monsterTurn') {
        if (board.filter(c => c.health < 1).length > 0) {
          cleanBoard()
        } else {
          if (values.monsterHealth < 1 && endState && endState.gameValues.active) {
            return endBattle()
          }

          animationHandler.addAnimation('monster', {
            type: 'ability',
            position: getMonsterPosition(),
          })
        }
      }

      else if (event.type === 'creatureAttack') {
        animationHandler.addAnimation('creature', {
          type: 'attack',
          creatureId: event.creature.id,
          creature: event.creature,
          position: getCreaturePosition(event.creature.id),
          targetPosition: getMonsterPosition(),
        })
      }
    }
  }, [endTurnEventOrder, board])

  const resetBattleState = () => {
    setValues({})
    setBattleEffects()
    setHand([])
    setBoard([])
    setActions([])
    setAttackingOrder([])
    setEndState()
  }

  const submitBattleActions = async () => {
    setPendingTx(true)

    const res = await dojo.executeTx([{ contractName: "battle_systems", entrypoint: "battle_actions", calldata: [values.battleId, actions] }], game.values.isDemo)

    const gameValues = res.find(e => e.componentName === 'Game')
    const leaderboard = res.find(e => e.componentName === 'Leaderboard')
    const battleValues = res.find(e => e.componentName === 'Battle')
    const board = res.find(e => e.componentName === 'Board')

    setUpdatedValues(battleValues)

    if (gameValues) {
      setEndState({ gameValues, leaderboard })
    }

    setPendingTx(false)
  }

  const submitActions = async () => {

    await submitBattleActions()
  }

  const endTurn = async () => {
    await submitBattleActions()

    const eventOrder = []
    if (board.length > 0) {
      eventOrder.push(...board.map(creature => ({ creature, type: 'creatureAttack' })))
    }

    eventOrder.push({ type: 'monsterTurn' })
    setEndTurnEventOrder(eventOrder)
  }

  const startBattle = async (battle, battleEffects) => {
    animationHandler.resetAnimationHandler()

    setValues({ ...battle, monsterType: GET_MONSTER(battle.monsterId).monsterType })
    setBattleEffects({ ...battleEffects })
    setHand(battle.hand.map((card, i) => CARD_DETAILS(card, battle.deckIndex + i)))
    setBoard([])
    setActions([])

    setEndState()
  }

  const summonCreature = (creature) => {
    if (creature.cost > values.heroEnergy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    setValues(prev => ({ ...prev, heroEnergy: prev.heroEnergy - creature.cost }))

    summonEffect({
      creature, values, board, battleEffects, setBattleEffects,
      updateBoard, reduceMonsterAttack, increaseEnergy,
    })

    setBoard(prev => [...prev, creature])
    setActions(prev => [...prev, [0, creature.cardId]])
  }

  const startNewTurn = () => {
    setValues({ ...updatedValues, monsterType: GET_MONSTER(updatedValues.monsterId).monsterType })
    setHand(updatedValues.hand.map((card, i) => CARD_DETAILS(card, updatedValues.deckIndex + i)))

    setActions([])
    setUpdatedValues()
  }

  const endBattle = async () => {
    if (!endState.gameValues.active) {
      game.setScore(endState.gameValues.monstersSlain)
    } else {
      await delay(1000);
      game.setGame(endState.gameValues);
      game.actions.updateMapStatus(endState.gameValues.lastNodeId)
      resetBattleState()
    }
  }

  const monsterAttack = () => {
    endOfTurnMonsterEffect({})

    animationHandler.addAnimation('monster', {
      type: 'attack',
      position: getMonsterPosition(),
      targetPosition: getCreaturePosition(ADVENTURER_ID),
    })
  }

  // BOARD UTILS
  const updateBoardCreature = (creatureId, update) => {
    const updatedBoard = board.map(creature => creature.id === creatureId ? { ...creature, ...update } : creature)
    setBoard(updatedBoard)
  }

  const updateBoard = (creatureType, attack, health) => {
    const updatedBoard = board.map(creature => (creature.creatureType === creatureType || creatureType === tags.ALL)
      ? { ...creature, attack: creature.attack + attack, health: creature.health + health }
      : creature
    )
    setBoard(updatedBoard)
  }

  const cleanBoard = () => {
    setBoard(prev => prev.map(creature => creature.health < 1 ? { ...creature, dead: true } : creature))
  }

  // MONSTER UTILS
  const damageMonster = (amount) => {
    amount += battleEffects.enemyMarks
    setValues(prev => ({ ...prev, monsterHealth: Math.max(0, prev.monsterHealth - amount) }));
  }

  const reduceMonsterAttack = (amount) => {
    setValues(prev => ({ ...prev, monsterAttack: Math.max(1, prev.monsterAttack - amount) }))
  }

  const monsterAttackResult = async () => {
    damageHero(values.monsterAttack)

    if (endState) {
      return endBattle()
    }

    startNewTurn()
  }

  // CREATURE UTILS
  const damageCreature = (creature, amount) => {
    updateBoardCreature(creature.id, { health: creature.health - amount, dead: creature.health - amount < 1 })
  }

  const creatureAttack = (creatureId) => {
    let creature = { ...board.find(creature => creature.id === creatureId) }

    let extraDamage = attackEffect({ creature, values, board, setBattleEffects, reduceMonsterAttack, healHero })

    damageMonster(creature.attack + extraDamage)

    if (creature.cardId === 46) {
      creature.attack += 1;
    }

    creature.health -= values.monsterAttack;
    updateBoardCreature(creature.id, { ...creature })

    setEndTurnEventOrder(prev => prev.slice(1))
  }

  const creatureDeath = (creature) => {
    deathEffect({
      creature, values, board, battleEffects, setBattleEffects,
      updateBoard, reduceMonsterAttack, healHero, damageMonster
    })

    setBoard(prev => prev.filter(c => c.id !== creature.id))
  }

  // HERO UTILS
  const increaseEnergy = (amount) => {
    if (amount < 1) return;

    setValues(prev => ({ ...prev, heroEnergy: prev.heroEnergy + amount }))
  }

  const healHero = (amount) => {
    if (amount < 1) {
      return;
    }

    setValues(prev => ({ ...prev, heroHealth: prev.heroHealth + amount }))
  }

  const damageHero = (amount) => {
    amount -= battleEffects.heroDmgReduction

    if (amount < 1) {
      return;
    }

    setValues(prev => ({ ...prev, heroHealth: Math.max(0, prev.heroHealth - amount) }))
  }

  // POSITION UTILS
  const getMonsterPosition = () => {
    if (isMobile) {
      return {
        x: window.innerWidth / 2,
        y: (window.innerHeight - 56 - 150) * 0.95
      }
    }

    return {
      x: window.innerWidth / 2,
      y: (window.innerHeight - 56 - 200) * 0.95
    }
  }

  const getCreaturePosition = (id) => {
    if (id === ADVENTURER_ID) {
      if (isMobile) {
        return {
          x: 100,
          y: 0 - window.innerHeight * 0.12
        }
      }

      return {
        x: window.innerWidth / 2,
        y: (window.innerHeight - 56 - 200) * 0.50
      }
    }

    const index = board.findIndex(creature => creature.id === id)
    const startCoord = (window.innerWidth / 2) - (board.length * 136 - 16) / 2

    return {
      x: startCoord + (index * 136) + 60,
      y: (window.innerHeight - 56 - 200) * 0.69
    }
  }

  const fetchBattleState = async (battleId) => {
    setResettingState(true)
    setResettingState(false)
  }

  return (
    <BattleContext.Provider
      value={{
        actions: {
          startBattle,
          summonCreature,
          endTurn,
          submitActions
        },

        utils: {
          getMonsterPosition,
          getCreaturePosition,
          fetchBattleState,
          resetBattleState
        },

        state: {
          pendingTx,
          values,
          hand,
          board,
          battleEffects,
          resettingState,
        }
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};