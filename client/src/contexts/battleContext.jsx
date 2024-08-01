import { closeSnackbar, useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getBattleState } from "../api/indexer";
import { MONSTER_LIST } from "../battle/monsterUtils";
import { endOfTurnMonsterEffect } from "../battle/phaseUtils";
import { spellEffect } from "../battle/spellUtils";
import { summonEffect } from "../battle/summonUtils";
import { CARD_DETAILS, fetchBoardCreatures, tags, types } from "../helpers/cards";
import { ADVENTURER_ID, BATTLE_EFFECTS, START_ENERGY } from "../helpers/constants";
import { AnimationContext } from "./animationHandler";
import { DojoContext } from "./dojoContext";
import { DraftContext } from "./draftContext";
import { GameContext } from "./gameContext";

export const BattleContext = createContext()

export const BattleProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)
  const animationHandler = useContext(AnimationContext)

  const { enqueueSnackbar } = useSnackbar()
  const [pendingTx, setPendingTx] = useState(false)
  const [resettingState, setResettingState] = useState(false)

  const [battleId, setBattleId] = useState()

  const [hand, setHand] = useState([])
  const [board, setBoard] = useState([])

  const [monster, setMonster] = useState({})
  const [adventurer, setAdventurer] = useState({})

  const [creatureIndex, setCreatureIndex] = useState(0)

  const [battleEffects, setBattleEffects] = useState({ ...BATTLE_EFFECTS })

  const [targetFriendlyCreature, setTargetFriendlyCreature] = useState(false)

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
      animationHandler.consumeCompleted('monsterAbility')
      monsterAttack()
    }

    if (animation.type === 'monsterAttack') {
      animationHandler.consumeCompleted('monsterAttack')
      monsterAttackResult()
    }

    else if (animation.type === 'creatureAttack') {
      animationHandler.consumeCompleted('creatureAttack')
      creatureAttack(animation.creatureId)
    }

    else if (animation.type === 'creatureAttackFinished') {
      animationHandler.consumeCompleted('creatureAttackFinished')
      creatureAttackResult(animation.creatureId)
    }

    // eslint-ignore-next-line react-hooks/exhaustive-deps
  }, [animationHandler.completed])

  const submitBattleAction = async (contract, name, data) => {
    const startTime = Date.now();
    const res = await dojo.executeTx(contract, name, data)

    if (!res) {
      return fetchBattleState(battleId)
    }

    const gameValues = res.find(e => e.componentName === 'Game')
    const leaderboard = res.find(e => e.componentName === 'Leaderboard')
    const node = res.find(e => e.componentName === 'Node')

    if (leaderboard) {
      return game.setScore(Math.max(1, leaderboard.score))
    }

    if (gameValues) {
      const remainingTime = Math.max(0, 2000 - (Date.now() - startTime));

      setTimeout(() => {
        draft.levelUpCards();
        game.setGame(gameValues);
        game.actions.updateNodeStatus(node.nodeId, node.status)

        resetBattleState()
      }, remainingTime);
    }
  }

  const drawHand = () => {
    let cards = draft.cards.map(card => CARD_DETAILS(card.cardId, card.number, card.level))

    setHand(cards)
  }

  const resetBattleState = () => {
    setBoard([])
    setBattleId()
    setCreatureIndex(0)
    setMonster({})
    setAdventurer({})
    setBattleEffects({ ...BATTLE_EFFECTS })
  }

  const startBattle = async (battle) => {
    animationHandler.resetAnimationHandler()

    setHand([])
    setBattleId(battle.battleId)
    setAdventurer({ id: ADVENTURER_ID, health: battle.heroHealth, energy: battle.heroEnergy, armor: battle.heroArmor })
    setMonster({ ...MONSTER_LIST.find(monster => monster.id === battle.monsterId), attack: battle.monsterAttack, health: battle.monsterHealth })
    setBattleEffects({ ...BATTLE_EFFECTS })
    setCreatureIndex(battle.cardIndex)
  }

  const summonCreature = (creature, target) => {
    let cost = getCardCost(creature);

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    submitBattleAction("battle_systems", "summon_creature", [battleId, creature.id, target?.id || 0])

    animationHandler.addAnimation('monster', { type: 'intimidate' })

    setBattleEffects(prev => ({ ...prev, nextCardReduction: 0 }))
    setHand(prev => prev.filter((_, i) => (i !== hand.findIndex(card => card.id === creature.id))))
    decreaseEnergy(cost)

    summonEffect({ creature, shieldHero, target, setBoard, monster, damageMonster, battleEffects, setBattleEffects })

    let creatureId = creatureIndex + 1;
    creature.id = creatureId;

    setBoard(prev => [...prev, creature])
    setCreatureIndex(prev => prev + 1)

    setTargetFriendlyCreature()
  }

  const castSpell = (spell, target) => {
    let cost = getCardCost(spell);

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    setBattleEffects(prev => ({ ...prev, nextSpellReduction: 0, nextCardReduction: 0 }))
    setHand(prev => prev.filter((_, i) => (i !== hand.findIndex(card => card.id === spell.id))))
    decreaseEnergy(cost)

    spellEffect({ spell, shieldHero, target, damageMonster, increaseEnergy, healHero, battleEffects, setBattleEffects })

    submitBattleAction("battle_systems", "cast_spell", [battleId, spell.id, target?.id || 0])

    setTargetFriendlyCreature()
  }

  const discardCard = (card) => {
    if (adventurer.energy < 1 && !battleEffects.freeDiscard) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (battleEffects.freeDiscard) {
      setBattleEffects(prev => ({ ...prev, freeDiscard: false }))
    } else {
      decreaseEnergy(1);
    }

    setHand(prev => prev.filter(handCard => (handCard.id !== card.id)))

    submitBattleAction("battle_systems", "discard", [battleId, card.id])
  }

  const attack = (creature) => {
    submitBattleAction("battle_systems", "attack", [battleId, creature.id])

    animationHandler.addAnimation('creature', {
      type: 'attack',
      creatureId: creature.id,
      creature,
      position: getCreaturePosition(creature.id),
      targetPosition: getMonsterPosition()
    })
  }

  const endTurn = () => {
    submitBattleAction("battle_systems", "end_turn", [battleId])

    animationHandler.addAnimation('monster', {
      type: 'ability',
      position: getMonsterPosition(),
    })
  }

  const beginTurn = () => {
    setBoard(prev => prev.map(creature => ({ ...creature, resting: false })));
    setAdventurer(prev => ({ ...prev, energy: START_ENERGY }));

    if (battleEffects.damageImmune) {
      setBattleEffects(prev => ({ ...prev, damageImmune: false }))
    }
  }

  const monsterAttack = () => {
    endOfTurnMonsterEffect({ monster, setMonster, board, damageBoard, damageAdventurer, animationHandler })

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

      creatureHealth(creature, amount * -1)
    })
  }

  const creatureDead = (creature) => {
    animationHandler.addAnimation('creature', {
      type: 'death',
      creatureId: creature.id,
      position: getCreaturePosition(creature.id)
    })

    setBoard(prev => prev.filter(x => x.id !== creature.id))
  }

  const updateCreature = (id, update) => {
    setBoard(prev => prev.map(creature => {
      if (creature.id === id) return { ...creature, ...update }
      return creature
    }))
  }

  const creatureSleep = (target) => {
    updateCreature(target.id, { resting: true })
  }

  const removeShield = (target) => {
    updateCreature(target.id, { shield: false })
  }

  const creatureHealth = (target, amount) => {
    if (amount < 0) {
      animationHandler.addAnimation('damage', { targetId: target.id, damage: amount * -1 })
    }

    updateCreature(target.id, { health: target.health + amount })
  }

  const creatureAttack = (creatureId) => {
    let creature = board.find(creature => creature.id === creatureId)

    damageMonster(creature.attack)

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
    damageAdventurer(monster.attack)

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

    setAdventurer(prev => ({ ...prev, armor: prev.armor + amount }))
  }

  const damageAdventurer = (amount) => {
    if (amount < 1) {
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

  const damageMonster = (amount, cardId) => {
    if (monster.id === 403) {
      amount -= 1;
    }

    if (cardId) {
      board.filter(creature => creature.cardId === cardId).map(creature => {
        animationHandler.addAnimation('creature', {
          type: 'damageEffect',
          creatureId: creature.id,
          position: getCreaturePosition(creature.id),
          targetPosition: getMonsterPosition(),
          damageAmount: amount
        })
      })
    }

    animationHandler.addAnimation('damage', { targetId: monster.id, damage: amount })
    setMonster(prev => ({ ...prev, health: prev.health - amount }))
  }

  const setTargetFriendly = (card) => {
    setTargetFriendlyCreature(card)
  }

  const getMonsterPosition = () => {
    return {
      x: window.innerWidth / 2,
      y: (window.innerHeight - 56 - 200) * 0.95
    }
  }

  const getCreaturePosition = (id) => {
    if (id === ADVENTURER_ID) {
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
    setHand(data.handCards.map(card => CARD_DETAILS(card.card_id, data.battle.deck_iteration, card.hand_card_number, card.level)))
    setBoard(fetchBoardCreatures(data))

    setMonster({
      ...MONSTER_LIST.find(monster => monster.id === data.battle.monster_id),
      attack: data.battle.monster_attack,
      health: data.battle.monster_health
    })

    setAdventurer({
      id: ADVENTURER_ID,
      health: data.battle.hero_health,
      energy: data.battle.hero_energy,
      armor: data.battle.hero_armor
    })

    setCreatureIndex(data.battle.card_index)
    setTargetFriendlyCreature()

    setResettingState(false)
  }

  const getCardCost = (card) => {
    let cost = card.cost;

    if (monster.id === 5 && card.type === types.CREATURE) {
      cost += 1;
    }

    if (card.tag === tags.RENEWABLE) {
      cost = Math.max(1, cost - (card.level - 1));
    }

    if (card.type === types.SPELL) {
      cost = Math.max(0, cost - battleEffects.nextSpellReduction);
    }

    cost = Math.max(0, cost - battleEffects.nextCardReduction);

    return cost
  }

  return (
    <BattleContext.Provider
      value={{
        actions: {
          startBattle,
          summonCreature,
          castSpell,
          attack,
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
          getCardCost
        },

        state: {
          pendingTx,
          hand,
          board,
          monster,
          adventurer,
          battleEffects,
          targetFriendlyCreature,
          resettingState
        }
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};