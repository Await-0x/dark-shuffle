import React, { createContext, useContext, useState } from "react";
import { fetchCard, tags, types } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";

export const DraftContext = createContext()

export const DraftProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const [pendingTx, setPendingTx] = useState()

  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '')
  const [options, setOptions] = useState([])
  const [cards, setCards] = useState([])

  const [manaCurve, setManaCurve] = useState()

  const [tagCount, setTagCount] = useState(Object.keys(tags).map(_ => 0))

  const initializeState = () => {
    setOptions([])
    setCards([])
    setManaCurve({
      [types.CREATURE]: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [types.SPELL]: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
  }

  const updateDraftStats = (card) => {
    let copy = JSON.parse(JSON.stringify(manaCurve))

    if (card.cost > 7) {
      copy[card.type][8] += 1;
    } else {
      copy[card.type][card.cost] += 1;
    }

    setManaCurve(copy)

    let currentTagCount = [...tagCount]
    currentTagCount[Object.values(tags).indexOf(card.tag)] += 1

    setTagCount(currentTagCount)
  }

  const startDraft = async () => {
    initializeState()

    if (game.clientOnly) {
      return startDraftClientOnly()
    }

    const res = await dojo.executeTx("darkshuffle::systems::game::contracts::game_systems", "start_game", [playerName || 'Anonymous'])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const entropy = res.find(e => e.componentName === 'DraftEntropy')

      game.setDraftEntropy(entropy)
      game.setGame(gameValues)
    }
  }

  const getDraftOptions = async () => {
    const res = await dojo.executeTx("darkshuffle::systems::draft::contracts::draft_systems", "get_draft_options", [game.values.gameId, game.entropy.blockHash])

    if (res) {
      const draftOptions = res.filter(e => e.componentName === 'DraftOption')

      setOptions(draftOptions.map(option => fetchCard(option.cardId, 1, option.optionId)))
    }
  }

  const selectCard = async (card) => {
    if (pendingTx) return;

    setPendingTx(true)

    const res = await dojo.executeTx("darkshuffle::systems::draft::contracts::draft_systems", "pick_card", [game.values.gameId, card.id])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftCard = res.find(e => e.componentName === 'DraftCard')
      
      setOptions([])

      card.number = draftCard.number;
      setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
      updateDraftStats(card)
      
      if (gameValues) {
        game.setGame(gameValues)
        return
      }
      
      const entropy = res.find(e => e.componentName === 'DraftEntropy')
      game.setDraftEntropy(entropy)
    }

    setPendingTx(false)
  }

  return (
    <DraftContext.Provider
      value={{
        cards,
        selectCard,
        options,
        setOptions,
        manaCurve,
        tagCount,
        startDraft,
        pendingTx,
        getDraftOptions,
        setPlayerName,
        playerName
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};