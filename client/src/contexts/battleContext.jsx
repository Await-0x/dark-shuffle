import { closeSnackbar, useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';
import { getBattleState } from "../api/indexer";
import { endOfTurnMonsterEffect } from "../battle/phaseUtils";
import { spellEffect } from "../battle/spellUtils";
import { summonEffect } from "../battle/summonUtils";
import { CARD_DETAILS, fetchBoardCreatures, tags, types } from "../helpers/cards";
import { ADVENTURER_ID, BATTLE_EFFECTS } from "../helpers/constants";
import { AnimationContext } from "./animationHandler";
import { DojoContext } from "./dojoContext";
import { DraftContext } from "./draftContext";
import { GameContext } from "./gameContext";
import { GET_MONSTER } from "../battle/monsterUtils";
import { delay } from "../helpers/utilities";

export const BattleContext = createContext()

export const BattleProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)
  const animationHandler = useContext(AnimationContext)

  const { enqueueSnackbar } = useSnackbar()
  const [resettingState, setResettingState] = useState(false)

  const [battleId, setBattleId] = useState()

  const [hand, setHand] = useState([])
  const [board, setBoard] = useState([])

  const [monster, setMonster] = useState({})
  const [adventurer, setAdventurer] = useState({})

  const [creatureIndex, setCreatureIndex] = useState(0)
  const [roundEnergy, setRoundEnergy] = useState(0)

  const [battleEffects, setBattleEffects] = useState({ ...BATTLE_EFFECTS })

  const [targetFriendlyCreature, setTargetFriendlyCreature] = useState(false)

  const [endingTurn, setEndingTurn] = useState(false)
  const [attackingOrder, setAttackingOrder] = useState([])

  const [pendingTx, setPendingTx] = useState(false)
  const [txQueue, setTxQueue] = useState([])
  const [endState, setEndState] = useState()

  useEffect(() => {
    if (!pendingTx) {
      if (txQueue.length > 0) {
        submitBattleAction(txQueue[0])
      }
    }
  }, [pendingTx, txQueue])

  useEffect(() => {
    if (endingTurn) {
      setAttackingOrder([...board.filter(creature => !creature.resting), 'monster'])
    }
  }, [endingTurn])

  useEffect(() => {
    if (endState && (monster.health < 1 || adventurer.health < 1)) {
      endBattle()
    }
  }, [endState, monster.health, adventurer.health])

  useEffect(() => {
    if (targetFriendlyCreature) {
      enqueueSnackbar('Select target', { preventDuplicate: true, persist: true, variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    } else {
      closeSnackbar()
    }
  }, [targetFriendlyCreature])

  useEffect(() => {
    if (hand.length === 0 && monster.id) {
      drawHand()
    }
  }, [hand, monster])

  useEffect(() => {
    if (animationHandler.completed.length < 1) {
      return
    }

    const animation = animationHandler.completed[0]

    if (animation.type === 'poisonSpray') {
      animationHandler.animationCompleted({ type: 'monsterAbility' })
    }

    if (animation.type === 'monsterAbility') {
      monsterAttack()
    }

    if (animation.type === 'monsterAttack') {
      monsterAttackResult()
    }

    if (animation.type === 'creatureAttack') {
      creatureAttack(animation.creatureId)
    }

    if (animation.type === 'creatureAttackFinished') {
      creatureAttackResult(animation.creatureId)
    }

    animationHandler.consumeCompleted()
    // eslint-ignore-next-line react-hooks/exhaustive-deps
  }, [animationHandler.completed])

  useEffect(() => {
    if (monster.id === 18 && monster.health < 30 && monster.attack === monster.startAttack) {
      setMonster(prev => ({ ...prev, attack: prev.startAttack * 2 }))
    } else if (monster.id === 18 && monster.health >= 30 && monster.attack > monster.startAttack) {
      setMonster(prev => ({ ...prev, attack: prev.startAttack }))
    }

    if (monster.id === 21 && monster.health > 50 && monster.attack < monster.startAttack + 10) {
      setMonster(prev => ({ ...prev, attack: prev.startAttack + 10 }))
    } else if (monster.id === 21 && monster.health <= 50 && monster.attack > monster.startAttack) {
      setMonster(prev => ({ ...prev, attack: prev.startAttack }))
    }
  }, [monster.health])

  useEffect(() => {
    if (!endingTurn) return;

    if (attackingOrder.length > 0) {
      if (attackingOrder[0] === 'monster') {
        animationHandler.addAnimation('monster', {
          type: 'ability',
          position: getMonsterPosition(),
        })
      } else {
        animationHandler.addAnimation('creature', {
          type: 'attack',
          creatureId: attackingOrder[0].id,
          creature: attackingOrder[0],
          position: getCreaturePosition(attackingOrder[0].id),
          targetPosition: getMonsterPosition(),
        })
      }
    }
  }, [attackingOrder])

  const submitBattleAction = async ({ contractName, entrypoint, calldata }) => {
    setPendingTx(true)

    const res = await dojo.executeTx([{ contractName, entrypoint, calldata }], game.values.isDemo)

    if (!res) {
      setTxQueue([])
      return fetchBattleState(battleId)
    }

    setTxQueue(prev => prev.slice(1))
    setPendingTx(false)

    const gameValues = res.find(e => e.componentName === 'Game')
    const leaderboard = res.find(e => e.componentName === 'Leaderboard')
    const node = res.find(e => e.componentName === 'Node')

    if (gameValues) {
      setEndState({ gameValues, node, leaderboard })
    }
  }

  const endBattle = async () => {
    if (!endState.gameValues.active) {
      game.setScore(Math.max(1, endState.gameValues.heroXp))
    } else {
      draft.levelUpCards();

      await delay(1000);
      game.setGame(endState.gameValues);
      game.actions.updateNodeStatus(endState.node.nodeId, endState.node.status)
      resetBattleState()
    }
  }

  const drawHand = () => {
    let cards = draft.cards.map(card => CARD_DETAILS(card.cardId, card.id, card.level))

    setHand(cards)
  }

  const resetBattleState = () => {
    setBoard([])
    setBattleId()
    setCreatureIndex(0)
    setMonster({})
    setAdventurer({})
    setBattleEffects({ ...BATTLE_EFFECTS })
    setRoundEnergy(0)
    setEndingTurn(false)
    setAttackingOrder([])
    setEndState()
  }

  const startBattle = async (battle) => {
    animationHandler.resetAnimationHandler()

    setBoard([])
    setHand([])
    setBattleId(battle.battleId)
    setAdventurer({ id: ADVENTURER_ID, health: battle.heroHealth, energy: battle.heroEnergy, armor: battle.heroArmor, burn: battle.heroBurn })
    setMonster({ ...GET_MONSTER(battle.monsterId, game.values.branch), attack: battle.monsterAttack, health: battle.monsterHealth, startHealth: battle.monsterHealth, startAttack: battle.monsterAttack })
    setBattleEffects({ ...BATTLE_EFFECTS })
    setCreatureIndex(battle.cardIndex)
    setRoundEnergy(battle.roundEnergy)
    setEndState()
  }

  const summonCreature = (creature, target) => {
    let cost = getCardCost(creature);

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    setTxQueue(prev => [...prev, { contractName: "battle_systems", entrypoint: "summon_creature", calldata: [battleId, creature.id, target?.id ?? 0] }])

    animationHandler.addAnimation('monster', { type: 'intimidate' })

    setBattleEffects(prev => ({ ...prev, nextCardReduction: 0 }))
    setHand(prev => prev.filter(handCard => handCard.id !== creature.id))
    decreaseEnergy(cost)

    summonEffect({
      creature, shieldHero, target, setBoard, branch: game.values.branch,
      monster, damageMonster, battleEffects, setBattleEffects, setRoundEnergy
    })

    let creatureId = creatureIndex + 1;

    setBoard(prev => [...prev, { ...creature, id: creatureId }])
    setCreatureIndex(prev => prev + 1)

    setTargetFriendlyCreature()
  }

  const castSpell = (spell, target) => {
    let cost = getCardCost(spell);

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    setBattleEffects(prev => ({ ...prev, nextSpellReduction: 0, nextCardReduction: 0 }))
    setHand(prev => prev.filter(handCard => handCard.id !== spell.id))
    decreaseEnergy(cost)

    spellEffect({ spell, shieldHero, target, damageMonster, increaseEnergy, healHero, battleEffects, setBattleEffects, setRoundEnergy, pierceDamageAdventurer })

    setTxQueue(prev => [...prev, { contractName: "battle_systems", entrypoint: "cast_spell", calldata: [battleId, spell.id, target?.id ?? 0] }])

    setTargetFriendlyCreature()
  }

  const discardCard = (card) => {
    let cost = 1;

    if (monster.id === 11) {
      cost += 1;
    }

    if (adventurer.energy < cost && !battleEffects.freeDiscard) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (battleEffects.freeDiscard) {
      setBattleEffects(prev => ({ ...prev, freeDiscard: false }))
    } else {
      decreaseEnergy(cost);
    }

    setHand(prev => prev.filter(handCard => (handCard.id !== card.id)))

    setTxQueue(prev => [...prev, { contractName: "battle_systems", entrypoint: "discard", calldata: [battleId, card.id] }])
  }

  const endTurn = () => {
    setEndingTurn(true)
    setTxQueue(prev => [...prev, { contractName: "battle_systems", entrypoint: "end_turn", calldata: [battleId] }])
  }

  const beginTurn = () => {
    setEndingTurn(false)
    setBoard(prev => prev.filter(creature => !creature.dead).map(creature => ({ ...creature, resting: false })));
    setAdventurer(prev => ({ ...prev, energy: roundEnergy }));

    if (battleEffects.damageImmune) {
      setBattleEffects(prev => ({ ...prev, damageImmune: false }));
    }
  }

  const monsterAttack = () => {
    endOfTurnMonsterEffect({ monster, setMonster, board, damageBoard, damageAdventurer, animationHandler, setAdventurer, branch: game.values.branch })

    animationHandler.addAnimation('monster', {
      type: 'attack',
      position: getMonsterPosition(),
      targetPosition: getCreaturePosition(ADVENTURER_ID),
    })
  }

  const damageBoard = (amount) => {
    board.forEach(creature => {
      if (creature.shield) {
        return removeShield(creature);
      }

      if (creature.health <= amount) {
        return creatureDead(creature);
      }

      creatureHealth(creature, amount * -1);
    })
  }

  const creatureDead = (creature) => {
    animationHandler.addAnimation('creature', {
      type: 'death',
      creatureId: creature.id,
      position: getCreaturePosition(creature.id)
    })

    updateCreature(creature.id, { dead: true })
  }

  const updateCreature = (id, update) => {
    setBoard(prev => prev.map(creature => {
      if (creature.id === id) return { ...creature, ...update }
      return creature;
    }))
  }

  const creatureSleep = (target) => {
    updateCreature(target.id, { resting: true });
  }

  const removeShield = (target) => {
    updateCreature(target.id, { shield: false });
  }

  const creatureHealth = (target, amount) => {
    if (amount < 0) {
      animationHandler.addAnimation('damage', { targetId: target.id, damage: amount * -1 })
    }

    updateCreature(target.id, { health: target.health + amount })
  }

  const creatureAttack = (creatureId) => {
    let creature = board.find(creature => creature.id === creatureId)

    damageMonster(creature.attack, 'Creature')

    if (creature.shield) {
      removeShield(creature)
    } else {
      creatureHealth(creature, monster.attack * -1)
    }
  }

  const creatureAttackResult = (creatureId) => {
    let creature = board.find(creature => creature.id === creatureId)

    if (creature.health <= 0) {
      creatureDead(creature)
    } else {
      creatureSleep(creature)
    }
  }

  const monsterAttackResult = () => {
    let attack = monster.attack;

    if (monster.id === 19) {
      pierceDamageAdventurer(game.values.branch)
      attack = Math.max(0, attack - game.values.branch)
    }

    damageAdventurer(attack)

    if (adventurer.burn > 0) {
      damageAdventurer(adventurer.burn);
    }

    beginTurn()
  }

  const increaseEnergy = (amount) => {
    if (amount === 0) return;

    setAdventurer(prev => ({ ...prev, energy: prev.energy + amount }));
  }

  const decreaseEnergy = (amount) => {
    if (amount === 0) return;

    setAdventurer(prev => ({ ...prev, energy: prev.energy - amount }));
  }

  const healHero = (amount) => {
    if (amount < 1) {
      return;
    }

    animationHandler.addAnimation('hero', { type: 'heal' })

    setAdventurer(prev => ({ ...prev, health: prev.health + amount }))
  }

  const shieldHero = (amount) => {
    if (amount < 1) {
      return;
    }

    animationHandler.addAnimation('hero', { type: 'shield' })

    setAdventurer(prev => ({ ...prev, armor: monster.id === 20 ? Math.min(10, prev.armor + amount) : prev.armor + amount }))
  }

  const pierceDamageAdventurer = (amount) => {
    if (amount < 1 || battleEffects.damageImmune) {
      return;
    }

    setAdventurer(prev => ({
      ...prev,
      health: prev.health - amount
    }))
  }

  const damageAdventurer = (amount) => {
    if (amount < 1 || battleEffects.damageImmune) {
      return;
    }

    animationHandler.addAnimation('damage', { targetId: ADVENTURER_ID, damage: amount })
    setAdventurer(prev => ({
      ...prev,
      health: prev.health - Math.max(0, amount - prev.armor),
      armor: Math.max(0, prev.armor - amount)
    }))
  }

  const healMonster = (amount) => {
    setMonster(prev => ({ ...prev, health: prev.health + amount }))
  }

  const damageMonster = (amount, damageType) => {
    if (monster.id === 3) {
      amount -= game.values.branch;
    }

    if (damageType === 'Spell') {
      if (monster.id === 8) {
        amount = 0;
      }

      if (monster.id === 15) {
        damageAdventurer(game.values.branch);
      }
    }

    if (damageType === 'Creature') {
      if (monster.id === 9) {
        amount = 0;
      }

      if (monster.id === 16) {
        damageAdventurer(game.values.branch);
      }
    }

    if (monster.health <= amount) {
      setAttackingOrder([])
    } else if (attackingOrder.length > 0) [
      setAttackingOrder(prev => prev.slice(1))
    ]

    animationHandler.actions.setAnimations(prev => ({ ...prev, monsterDamaged: amount }));
    setMonster(prev => ({ ...prev, health: prev.health - amount }));
  }

  const setTargetFriendly = (card) => {
    setTargetFriendlyCreature(card);
  }

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
    let data = await getBattleState(parseInt(battleId))

    setBattleId(data.battle.battle_id)
    setBattleEffects({
      nextSpellReduction: data.battleEffects.next_spell_reduction,
      nextCardReduction: data.battleEffects.next_card_reduction,
      freeDiscard: data.battleEffects.free_discard,
      damageImmune: data.battleEffects.damage_immune
    })

    setHand(data.handCards.map(card => CARD_DETAILS(card.card_id, card.hand_card_number, card.level)))
    setBoard(fetchBoardCreatures(data))

    setMonster({
      ...GET_MONSTER(data.battle.monster_id, game.values.branch),
      attack: data.battle.monster_attack,
      health: data.battle.monster_health,
      startHealth: data.battle.monster_health,
      startAttack: data.battle.monster_attack
    })

    setAdventurer({
      id: ADVENTURER_ID,
      health: data.battle.hero_health,
      energy: data.battle.hero_energy,
      armor: data.battle.hero_armor,
      burn: data.battle.hero_burn
    })

    setRoundEnergy(data.battle.round_energy)
    setCreatureIndex(data.battle.card_index)
    setTargetFriendlyCreature()

    draft.setBattleCards(data.battle.deck)

    setPendingTx(false)
    setResettingState(false)
  }

  const getCardCost = (card) => {
    let cost = card.cost;

    if (!battleId) {
      return cost;
    }

    if (monster.id === 5 && card.type === types.CREATURE) {
      cost += 1;
    }

    if (monster.id === 10 && card.type === types.SPELL) {
      cost += 1;
    }

    if (card.tag === tags.RENEWABLE) {
      cost = Math.max(1, cost - (card.level - 1));
    }

    if (card.type === types.SPELL) {
      cost = Math.max(0, cost - battleEffects.nextSpellReduction);
    }

    cost = Math.max(0, cost - battleEffects.nextCardReduction);

    return cost;
  }

  return (
    <BattleContext.Provider
      value={{
        actions: {
          startBattle,
          summonCreature,
          castSpell,
          discardCard,
          endTurn
        },

        utils: {
          getMonsterPosition,
          getCreaturePosition,
          damageBoard,
          damageAdventurer,
          setTargetFriendly,
          fetchBattleState,
          healMonster,
          getCardCost,
          resetBattleState
        },

        state: {
          pendingTx,
          hand,
          board,
          monster,
          adventurer,
          battleEffects,
          targetFriendlyCreature,
          resettingState,
          roundEnergy
        }
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};