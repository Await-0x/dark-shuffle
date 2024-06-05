import { useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { adventurerHealedEffect } from "../battle/adventurerUtils";
import { deathEffect } from "../battle/deathUtils";
import { MONSTER_LIST } from "../battle/monsterUtils";
import { endOfTurnMonsterEffect } from "../battle/phaseUtils";
import { spellEffect } from "../battle/spellUtils";
import { summonEffect } from "../battle/summonUtils";
import { fetchCard } from "../helpers/cards";
import { ADVENTURER_ID, EFFECTS, START_ENERGY } from "../helpers/constants";
import { AnimationContext } from "./animationHandler";
import { DojoContext } from "./dojoContext";
import { DraftContext } from "./draftContext";
import { GameContext } from "./gameContext";
import { getBattleState } from "../api/indexer";

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

  const [round, setRound] = useState(0)
  const [deckIteration, setDeckIteration] = useState(0)
  const [creatureIndex, setCreatureIndex] = useState(0)

  const [battleEffects, setBattleEffects] = useState({ ...EFFECTS })
  const [roundEffects, setRoundEffects] = useState({ ...EFFECTS })

  const [targetFriendlyCreature, setTargetFriendlyCreature] = useState(false)

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

  useEffect(() => {
    if (resettingState) return;

    setHand(draft.cards.map(card => fetchCard(card.cardId, deckIteration, card.number)))
  }, [deckIteration])

  useEffect(() => {
    if (resettingState) return;

    setRoundEffects({ ...EFFECTS })
  }, [round])

  const submitBattleAction = async (contract, name, data) => {
    const startTime = Date.now();
    const res = await dojo.executeTx(contract, name, data)

    if (!res) {
      return fetchBattleState(battleId)
    }

    const gameValues = res.find(e => e.componentName === 'Game')
    const leaderboard = res.find(e => e.componentName === 'Leaderboard')

    if (leaderboard) {
      return game.setScore(Math.max(1, leaderboard.score))
    }

    if (gameValues) {
      const remainingTime = Math.max(0, 2000 - (Date.now() - startTime));
      setTimeout(() => {
        game.setGame(gameValues);
      }, remainingTime);
    }
  }

  const startBattle = async () => {
    setBoard([])
    animationHandler.resetAnimationHandler()

    setPendingTx(true)

    const res = await dojo.executeTx("darkshuffle::systems::game::contracts::game_systems", "start_battle", [game.values.gameId])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const battle = res.find(e => e.componentName === 'Battle')

      setBattleId(battle.battleId)
      setRound(battle.round)
      setAdventurer({ id: ADVENTURER_ID, health: battle.heroHealth, energy: battle.heroEnergy })
      setMonster({ ...MONSTER_LIST.find(monster => monster.id === battle.monsterId), attack: battle.monsterAttack, health: battle.monsterHealth })
      setDeckIteration(battle.deckIteration)
      setCreatureIndex(battle.cardIndex)

      game.setGame(gameValues)
    }

    setPendingTx(false)
  }

  const summonCreature = (creature, target) => {
    if (creature.cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    submitBattleAction("darkshuffle::systems::battle::contracts::battle_systems", "summon_creature", [battleId, creature.id, target?.id || 0])

    animationHandler.addAnimation('monster', { type: 'intimidate' })

    setHand(prev => prev.filter((_, i) => (i !== hand.findIndex(card => card.id === creature.id))))
    decreaseEnergy(creature.cost)

    summonEffect({
      creature, board, healAdventurer, deckIteration, target: target, damageMonster,
      setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
      roundEffects, setRoundEffects, battleEffects, setBattleEffects, hand
    })

    let creatureId = creatureIndex + 1;
    creature.id = creatureId;

    setBoard(prev => [...prev, creature])
    setCreatureIndex(prev => prev + 1)
    setTargetFriendlyCreature()
  }

  const castSpell = (spell, target) => {
    let cost = Math.max(0, spell.cost - battleEffects.nextSpellReduction)

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    setHand(prev => prev.filter((_, i) => (i !== hand.findIndex(card => card.id === spell.id))))
    decreaseEnergy(cost)

    spellEffect({
      spell, board, healAdventurer, deckIteration, target: target, damageMonster,
      setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
      roundEffects, setRoundEffects, battleEffects, setBattleEffects, hand
    })

    submitBattleAction("darkshuffle::systems::battle::contracts::battle_systems", "cast_spell", [battleId, spell.id, target?.id || 0])
    setTargetFriendlyCreature()
  }

  const discardCard = (card) => {
    if (adventurer.energy < 1) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    decreaseEnergy(1);

    setBattleEffects(prev => ({ ...prev, cardsDiscarded: prev.cardsDiscarded + 1 }))
    setRoundEffects(prev => ({ ...prev, cardsDiscarded: prev.cardsDiscarded + 1 }))

    setHand(prev => prev.filter(handCard => (handCard.id !== card.id)))

    submitBattleAction("darkshuffle::systems::battle::contracts::battle_systems", "discard", [battleId, card.id])
  }

  const attack = (creature) => {
    submitBattleAction("darkshuffle::systems::battle::contracts::battle_systems", "attack", [battleId, creature.id])

    animationHandler.addAnimation('creature', {
      type: 'attack',
      creatureId: creature.id,
      creature,
      position: getCreaturePosition(creature.id),
      targetPosition: getMonsterPosition()
    })
  }

  const endTurn = () => {
    submitBattleAction("darkshuffle::systems::battle::contracts::battle_systems", "end_turn", [battleId])

    animationHandler.addAnimation('monster', {
      type: 'ability',
      position: getMonsterPosition(),
    })
  }

  const beginTurn = () => {
    setRound(prev => prev + 1)
    setBoard(prev => prev.map(creature => ({ ...creature, resting: false })))
    setAdventurer(prev => ({ ...prev, energy: START_ENERGY }));

    if (hand.length === 0) {
      setDeckIteration(prev => prev + 1)
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

    setBattleEffects(prev => ({ ...prev, deadCreatures: prev.deadCreatures + 1 }))
    deathEffect({ creature, hand, setHand, updateHandCard, board, setBoard })
  }

  const updateHandCard = (cardId, update) => {
    setHand(prev => prev.map(card => {
      if (cardId === card.cardId) return { ...card, ...update }
      return card
    }))
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

  const healAdventurer = (amount) => {
    if (amount < 1) {
      return;
    }

    animationHandler.addAnimation('hero', { type: 'heal' })

    adventurerHealedEffect({ heal: amount, board, setBoard, damageMonster })

    setAdventurer(prev => ({ ...prev, health: prev.health + amount }))
  }

  const damageAdventurer = (amount) => {
    if (amount < 1) {
      return;
    }

    animationHandler.addAnimation('damage', { targetId: ADVENTURER_ID, damage: amount })
    setAdventurer(prev => ({ ...prev, health: prev.health - amount }))
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
    let data = await getBattleState(battleId)

    setBattleId(data.battle.battle_id)
    setHand(data.handCards.map(card => fetchCard(card.card_id, data.battle.deck_iteration, card.hand_card_number)))
    setBoard(data.creatures.map(card => ({
      id: card.creature_id,
      cardId: card.card_id,
      cost: card.cost,
      attack: card.attack,
      health: card.health,
      shield: card.shield,
      resting: card.resting_round >= data.battle.round
    })))

    setMonster({
      ...MONSTER_LIST.find(monster => monster.id === data.battle.monster_id),
      attack: data.battle.monster_attack,
      health: data.battle.monster_health
    })

    setAdventurer({
      id: ADVENTURER_ID,
      health: data.battle.hero_health,
      energy: data.battle.hero_energy
    })

    setRound(data.battle.round)
    setDeckIteration(data.battle.deck_iteration)
    setCreatureIndex(data.battle.card_index)
    setBattleEffects({
      cardsDiscarded: data.battleEffects.cards_discarded,
      creaturesPlayed: data.battleEffects.creatures_played,
      spellsPlayed: data.battleEffects.spells_played,
      demonsPlayed: data.battleEffects.demons_played,
      nextSpellReduction: data.battleEffects.next_spell_reduction,
      deadCreatures: data.battleEffects.dead_creatures
    })
    setRoundEffects({
      ...EFFECTS,
      creaturesPlayed: data.roundEffects.creatures_played
    })
    setTargetFriendlyCreature(false)

    setResettingState(false)
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
          fetchBattleState
        },

        state: {
          pendingTx,
          hand,
          board,
          monster,
          adventurer,
          deckIteration,
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