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

  const [pendingTx, setPendingTx] = useState(false)
  const [txQueue, setTxQueue] = useState([])

  useEffect(() => {
    if (!pendingTx) {
      if (txQueue.length > 0) {
        submitBattleAction(txQueue[0])
      }
    }
  }, [pendingTx, txQueue])

  useEffect(() => {
    if (targetFriendlyCreature) {
      enqueueSnackbar('Select target', { preventDuplicate: true, persist: true, variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    } else {
      closeSnackbar()
    }
  }, [targetFriendlyCreature])

  useEffect(() => {
    if (hand.length === 0 && monster.id) {
      console.log(hand.length, monster.id)
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

    if (animation.type === 'lastAttackAnimation') {
      animationHandler.addAnimation('monster', {
        type: 'ability',
        position: getMonsterPosition(),
      })
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

  const submitBattleAction = async ({ contract, name, data }) => {
    setPendingTx(true)

    const startTime = Date.now();
    const res = await dojo.executeTx(contract, name, data)

    if (!res) {
      setTxQueue([])
      return fetchBattleState(battleId)
    }

    setTxQueue(prev => prev.slice(1))
    setPendingTx(false)

    const gameValues = res.find(e => e.componentName === 'Game')
    const leaderboard = res.find(e => e.componentName === 'Leaderboard')
    const node = res.find(e => e.componentName === 'Node')
    const entropy = res.find(e => e.componentName === 'Entropy')

    if (entropy) {
      game.setGameEntropy(entropy);
    }

    if (leaderboard) {
      game.setScore(Math.max(1, leaderboard.score))
      return
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
  }

  const startBattle = async (battle) => {
    animationHandler.resetAnimationHandler()

    setHand([])
    setBattleId(battle.battleId)
    setAdventurer({ id: ADVENTURER_ID, health: battle.heroHealth, energy: battle.heroEnergy, armor: battle.heroArmor, burn: battle.heroBurn })
    setMonster({ ...GET_MONSTER(battle.monsterId), attack: battle.monsterAttack, health: battle.monsterHealth, startHealth: battle.monsterHealth, startAttack: battle.monsterAttack })
    setBattleEffects({ ...BATTLE_EFFECTS })
    setCreatureIndex(battle.cardIndex)
    setRoundEnergy(battle.roundEnergy)
  }

  const summonCreature = (creature, target) => {
    let cost = getCardCost(creature);

    if (cost > adventurer.energy) {
      return enqueueSnackbar('Not enough energy', { variant: 'warning' })
    }

    if (board.length > 5) {
      return enqueueSnackbar('Board is full', { variant: 'warning' })
    }

    setTxQueue(prev => [...prev, { contract: "battle_systems", name: "summon_creature", data: [battleId, creature.id, target?.id ?? 0] }])

    animationHandler.addAnimation('monster', { type: 'intimidate' })

    setBattleEffects(prev => ({ ...prev, nextCardReduction: 0 }))
    setHand(prev => prev.filter(handCard => handCard.id !== creature.id))
    decreaseEnergy(cost)

    summonEffect({ creature, shieldHero, target, setBoard, monster, damageMonster, battleEffects, setBattleEffects, setRoundEnergy })

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

    setTxQueue(prev => [...prev, { contract: "battle_systems", name: "cast_spell", data: [battleId, spell.id, target?.id ?? 0] }])

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

    setTxQueue(prev => [...prev, { contract: "battle_systems", name: "discard", data: [battleId, card.id] }])
  }

  const boardAttack = () => {
    board.map((creature, i) => {
      animationHandler.addAnimation('creature', {
        type: 'attack',
        creatureId: creature.id,
        creature,
        position: getCreaturePosition(creature.id),
        targetPosition: getMonsterPosition(),
        delay: i,
        lastAttack: i === board.length - 1
      })
    })
  }

  const endTurn = () => {
    setTxQueue(prev => [...prev, { contract: "battle_systems", name: "end_turn", data: [battleId] }])

    boardAttack()
  }

  const beginTurn = () => {
    setBoard(prev => prev.map(creature => ({ ...creature, resting: false })));
    setAdventurer(prev => ({ ...prev, energy: roundEnergy }));

    if (battleEffects.damageImmune) {
      setBattleEffects(prev => ({ ...prev, damageImmune: false }));
    }
  }

  const monsterAttack = () => {
    endOfTurnMonsterEffect({ monster, setMonster, board, damageBoard, damageAdventurer, animationHandler, setAdventurer })

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

    setBoard(prev => prev.filter(x => x.id !== creature.id));
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
      amount -= 1;
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
      ...GET_MONSTER(data.battle.monster_id),
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

    draft.setDeckFromGraph(data.battle.deck)

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
          endTurn,
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
          resettingState
        }
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};