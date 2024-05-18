import React, { createContext, useContext, useState } from "react";
import { CARD_LIST, fetchCard, tags, types } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";
import { shuffle } from "../helpers/utilities";
import { DECK_SIZE } from "../helpers/constants";

export const DraftContext = createContext()

export const DraftProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const [pendingTx, setPendingTx] = useState()

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

  const startDraftClientOnly = async () => {
    game.setGame({ gameId: 1, inDraft: true })
    game.setEntropy({ blockNumber: 0, blockHash: 1 })

    setOptions(shuffle(CARD_LIST).slice(0, 3).map(card => fetchCard(card.cardId, 1, 0)))
  }

  const selectCardClientOnly = async (card) => {
    if (cards.length === DECK_SIZE - 1) {
      game.setGame({ inDraft: false })
    } else {
      setOptions(shuffle(CARD_LIST).slice(0, 3).map(card => fetchCard(card.cardId, 1, 0)))
    }

    setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
    updateDraftStats(card)
  }

  const startDraft = async () => {
    initializeState()

    if (game.clientOnly) {
      return startDraftClientOnly()
    }

    const res = await dojo.executeTx("darkshuffle::systems::game::contracts::game_systems", "start_game", [])

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
      
      setOptions([])
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
        getDraftOptions
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};