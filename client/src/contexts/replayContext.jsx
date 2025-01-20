import { useAccount, useConnect } from '@starknet-react/core';
import { useSnackbar } from 'notistack';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getGameTxs } from '../api/indexer';
import { CARD_DETAILS, formatBoard } from '../helpers/cards';
import { translateEvent } from '../helpers/events';
import { generateMapNodes } from '../helpers/map';
import { BattleContext } from './battleContext';
import { DraftContext } from './draftContext';
import { GameContext } from './gameContext';

// Create a context
const ReplayContext = createContext();

// Create a provider component
export const ReplayProvider = ({ children }) => {
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { account } = useAccount()
  const { connect, connectors } = useConnect();
  let cartridgeConnector = connectors.find(conn => conn.id === "controller")

  const { enqueueSnackbar } = useSnackbar()
  const [txHashes, setTxHashes] = useState([]);
  const [step, setStep] = useState(0)
  const [translatedEvents, setTranslatedEvents] = useState({})

  useEffect(() => {
    if (translatedEvents[step]) {
      applyEvents()
      fetchEvents(step + 2)
    }
  }, [step, translatedEvents])

  const fetchEvents = async (step, txHash) => {
    if (translatedEvents[step]) {
      return
    }

    if (!account) {
      connect({ connector: cartridgeConnector })
      return
    }

    const receipt = await account.waitForTransaction(txHash || txHashes[step], { retryInterval: 100 })
    if (!receipt) {
      enqueueSnackbar('Failed to load replay', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
      endReplay()
    }

    const events = receipt.events.map(event => translateEvent(event)).filter(Boolean)
    setTranslatedEvents(prev => ({ ...prev, [step]: events }))
  }

  const startReplay = async (game_id) => {
    if (!account) {
      connect({ connector: cartridgeConnector })
      return
    }

    let txs = await getGameTxs(game_id)

    if (txs.length > 0) {
      fetchEvents(0, txs[0].tx_hash)
      fetchEvents(1, txs[1].tx_hash)
      setTxHashes(txs.map(tx => tx.tx_hash))
    } else {
      enqueueSnackbar('Failed to load replay', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }
  }

  const endReplay = () => {
    setStep(0)
    setTxHashes([])
    setTranslatedEvents({})

    battle.utils.resetBattleState()
    game.endGame()
  }

  const nextStep = async () => {
    if (!translatedEvents[step + 1]) return;

    if (step < txHashes.length - 1) {
      setStep(prev => prev + 1)
    } else {
      endReplay()
    }
  }

  const previousStep = async () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  const applyEvents = () => {
    const events = translatedEvents[step]

    const gameValues = events.find(e => e.componentName === 'Game')
    if (gameValues) {
      game.setGame({ ...gameValues, replay: true })

      if (gameValues.heroHealth < 1) {
        game.setScore(Math.max(1, gameValues.heroXp))
      }
    }

    const draftValues = events.find(e => e.componentName === 'Draft')
    if (draftValues) {
      draft.update.setCards(draftValues.cards.map(card => CARD_DETAILS(card)))
      draft.update.setOptions(draftValues.options.map(option => CARD_DETAILS(option)))
    }

    const mapValues = events.find(e => e.componentName === 'Map')
    if (mapValues) {
      const computedMap = generateMapNodes(mapValues.level, mapValues.seed)
      game.setMap(computedMap);
    }

    const battleValues = events.find(e => e.componentName === 'Battle')
    if (battleValues) {
      battle.actions.startBattle(battleValues)

      if (gameValues?.lastNodeId) {
        game.actions.updateMapStatus(gameValues.lastNodeId)
      }
    }

    const boardValues = events.find(e => e.componentName === 'Board')
    if (boardValues) {
      battle.utils.setBoard(formatBoard(boardValues))
    }
  }

  const getDraftCardSelection = () => {
    const event = translatedEvents[step + 1]
    const draftValues = event?.find(e => e.componentName === 'Draft')
    if (!draftValues) return null

    return draft.getState.options.findIndex(option => option.cardId === draftValues.cards[draftValues.cards.length - 1])
  }

  const getMapSelection = () => {
    const event = translatedEvents[step + 1]
    const gameValues = event?.find(e => e.componentName === 'Game')
    if (!gameValues) return null

    return gameValues.lastNodeId
  }

  const getPlayedCards = () => {
    const event = translatedEvents[step + 1]
    const nextBattleValues = event?.find(e => e.componentName === 'Battle')
    const battleValues = translatedEvents[step]?.find(e => e.componentName === 'Battle')
    if (!battleValues || !nextBattleValues) return null

    return battleValues.hand.filter(card => !nextBattleValues.hand.includes(card))
  }

  return (
    <ReplayContext.Provider value={{
      startReplay,
      endReplay,
      nextStep,
      previousStep,
      getDraftCardSelection,
      getMapSelection,
      getPlayedCards
    }}>
      {children}
    </ReplayContext.Provider>
  );
};

export const useReplay = () => {
  return useContext(ReplayContext);
};

