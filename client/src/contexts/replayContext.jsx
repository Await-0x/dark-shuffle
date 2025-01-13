import { useSnackbar } from 'notistack';
import React, { createContext, useContext, useState } from 'react';
import { CARD_DETAILS } from '../helpers/cards';
import { translateEvent } from '../helpers/events';
import { BattleContext } from './battleContext';
import { DraftContext } from './draftContext';
import { GameContext } from './gameContext';
import { generateMapNodes } from '../helpers/map';

// Create a context
const ReplayContext = createContext();

// Create a provider component
export const ReplayProvider = ({ children }) => {
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { enqueueSnackbar } = useSnackbar()
  const [txHashes, setTxHashes] = useState([]);
  const [step, setStep] = useState(0)

  const startReplay = (game_id) => {
    const txs = []

    
  }

  const endReplay = () => {
    setStep(0)
    setTxHashes([])

    battle.utils.resetBattleState()
    game.endGame()
  }

  const nextStep = async () => {
    const receipt = await account.waitForTransaction(txHashes[step], { retryInterval: 100 })
    if (!receipt) {
      enqueueSnackbar('Failed to load replay', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
      endReplay()
    }

    setStep(prev => prev + 1)

    const events = receipt.events.map(event => translateEvent(event)).filter(Boolean)

    const gameValues = events.find(e => e.componentName === 'Game')
    if (gameValues) {
      game.setGame(gameValues)
    }

    const draftValues = res.find(e => e.componentName === 'Draft')
    if (draftValues) {
      draft.update.setCards(draftValues.cards.map(card => CARD_DETAILS(card)))
      draft.update.setOptions(draftValues.options.map(option => CARD_DETAILS(option)))
    }

    const mapValues = res.find(e => e.componentName === 'Map')
    if (mapValues) {
      const computedMap = generateMapNodes(mapValues.level, mapValues.seed)
      setMap(computedMap);
    }

    const battleValues = res.find(e => e.componentName === 'Battle')
    if (battleValues) {
      if (battleValues.round === 1) {
        battle.actions.startBattle(battleValues)
      }
    }

  }

  return (
    <ReplayContext.Provider value={{
      startReplay,
      endReplay,
      nextStep
    }}>
      {children}
    </ReplayContext.Provider>
  );
};

export const useReplay = () => {
  return useContext(ReplayContext);
};

