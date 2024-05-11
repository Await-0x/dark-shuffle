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

    const res = await dojo.executeTx("darkshuffle::actions::game::game_actions", "start_draft", [])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const action = res.find(e => e.componentName === 'Action')
      const draftOptions = res.filter(e => e.componentName === 'DraftOption')

      game.setAction(action)
      game.setGame(gameValues)
      setOptions(draftOptions.map(option => fetchCard(option.cardId, 1, 0)))
    }
  }

  const selectCard = async (card) => {
    if (game.clientOnly) {
      return selectCardClientOnly(card)
    }

    setPendingTx(true)

    const res = await dojo.executeTx("darkshuffle::actions::draft::draft_actions", "pick_card", [game.values.gameId, card.optionId, game.entropy.blockHash])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const action = res.find(e => e.componentName === 'Action')
      const draftOptions = res.filter(e => e.componentName === 'DraftOption')

      setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
      updateDraftStats(card)

      if (gameValues) {
        game.setGame(gameValues)
      }

      if (draftOptions) {
        setOptions(draftOptions.map(option => fetchCard(option.cardId, 1, 0)))
      }

      game.setAction(action)
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
        pendingTx
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};