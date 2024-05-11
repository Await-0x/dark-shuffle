import { useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import { adventurerHealedEffect, adventurerSelfDamagedEffect } from "../battle/adventurerUtils";
import { deathEffect } from "../battle/deathUtils";
import { fecthMonster } from "../battle/monsterUtils";
import { endOfTurnMonsterEffect, isAdventurerDead } from "../battle/phaseUtils";
import { spellEffect } from "../battle/spellUtils";
import { summonEffect } from "../battle/summonUtils";
import { fetchCard } from "../helpers/cards";
import { ADVENTURER_ID, DECK_SIZE, EFFECTS, START_ENERGY, START_HEALTH } from "../helpers/constants";
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

  const [gameOver, setGameOver] = useState(false)
  const [phase, setPhase] = useState(1)

  const [deck, setDeck] = useState([])
  const [hand, setHand] = useState([])
  const [board, setBoard] = useState([])

  const [monster, setMonster] = useState({})
  const [adventurer, setAdventurer] = useState({})

  const [round, setRound] = useState(0)
  const [deckIteration, setDeckIteration] = useState(0)

  const [battleEffects, setBattleEffects] = useState({ ...EFFECTS })
  const [roundEffects, setRoundEffects] = useState({ ...EFFECTS })

  const [targetFriendlyCreature, setTargetFriendlyCreature] = useState(true)
  const [actions, setActions] = useState([])

  useEffect(() => {
    if (phase === 1 && round && adventurer.health > 0) {
      beginTurn()
    }

    if (phase === 2) {
      endTurn()
    }
    // eslint-ignore-next-line react-hooks/exhaustive-deps
  }, [phase])

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
    let deck = draft.cards.map((card, i) => {
      let id = deckIteration * DECK_SIZE + i
      return fetchCard(card.cardId, deckIteration, id)
    });

    setDeck(deck)
  }, [deckIteration])

  useEffect(() => {
    setRoundEffects({ ...EFFECTS })
  }, [round])

  const startBattle = async () => {
    setRound(1)
    setBoard([])

    setAdventurer({ id: ADVENTURER_ID, health: START_HEALTH, energy: START_ENERGY })
    setMonster(fecthMonster(game.values.battlesWon))

    setHand(draft.cards.map((card, i) => fetchCard(card.cardId, deckIteration + 1, i + 1)));
    setDeckIteration(prev => prev + 1)

    setActions([])
    animationHandler.resetAnimationHandler()
    game.setGame({ inBattle: true });
  }

  const beginTurn = () => {
    setRound(prev => prev + 1)
    setBoard(prev => prev.map(creature => ({ ...creature, resting: false })))
    setAdventurer(prev => ({ ...prev, energy: START_ENERGY }));

    if (hand.length === 0) {
      setHand(deck)
      setDeckIteration(prev => prev + 1)
    }
  }

  const endTurn = () => {
    animationHandler.addAnimation('monster', {
      type: 'ability',
      position: getMonsterPosition(),
    })
  }

  const submitBattle = async (victory) => {
    if (game.clientOnly) {
      if (victory) {
        game.setGame({
          inBattle: false,
          battlesWon: game.values.battlesWon + 1
        })
      }

      return;
    }

    setPendingTx(true)
    const res = await dojo.executeTx("darkshuffle::actions::battle::game_actions", "submit_battle", [game.values.gameId, actions])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      game.setGame(gameValues)
    }

    setPendingTx(false)
  }

  const submitActions = async () => {
    if (monster.health <= 0) {
      return submitBattle(true)
    }

    if (isAdventurerDead({ monster, adventurer })) {
      submitBattle();
    }

    setActions(prev => [...prev, ['end_turn', 0]])
    setPhase(2)
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

    setPhase(1)
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

    if (amount >= adventurer.health) {
      setGameOver(true)
    }

    animationHandler.addAnimation('damage', { targetId: ADVENTURER_ID, damage: amount })
    setAdventurer(prev => ({ ...prev, health: prev.health - amount }))

    if (phase === 1) {
      adventurerSelfDamagedEffect({
        damage: amount, board, setBoard, hand, damageMonster,
        setHand, increaseEnergy
      })
    }
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

  const summonCreature = (creature, target) => {
    if (creature.cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    animationHandler.addAnimation('monster', { type: 'intimidate' })

    setHand(prev => prev.filter((_, i) => (i !== hand.findIndex(card => card.id === creature.id))))
    decreaseEnergy(creature.cost)

    summonEffect({
      creature, board, healAdventurer, deckIteration, target: target, damageMonster,
      setBoard, animationHandler, increaseEnergy, monster, damageAdventurer,
      roundEffects, setRoundEffects, battleEffects, setBattleEffects, hand
    })

    setBoard(prev => [...prev, creature])

    setActions(prev => [...prev, ['summon_creature', creature.id, target?.id || 0]])
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

    setActions(prev => [...prev, ['cast_spell', spell.id, target?.id || 0]])
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

    setActions(prev => [...prev, ['discard', card.id]])
  }

  const attack = (creature) => {
    setActions(prev => [...prev, ['attack_monster', creature.id]])

    animationHandler.addAnimation('creature', {
      type: 'attack',
      creatureId: creature.id,
      creature,
      position: getCreaturePosition(creature.id),
      targetPosition: getMonsterPosition()
    })
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

  return (
    <BattleContext.Provider
      value={{
        startBattle,
        submitActions,
        pendingTx,
        round,
        deck,
        hand,
        board,
        summonCreature,
        actions,
        attack,
        monster,
        getMonsterPosition,
        getCreaturePosition,
        adventurer,
        castSpell,
        setPhase,
        discardCard,
        gameOver,
        damageBoard,
        damageAdventurer,
        deckIteration,
        battleEffects,
        setTargetFriendly,
        targetFriendlyCreature
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};