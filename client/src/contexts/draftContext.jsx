import React, { createContext, useContext, useState } from "react";
import { getDraftCards, getEntropy } from "../api/indexer";
import { CARD_DETAILS, tags, types } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";

export const DraftContext = createContext()

export const DraftProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  
  const [pendingTx, setPendingTx] = useState()
  const [pendingCard, setPendingCard] = useState()

  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') ?? '')
  const [options, setOptions] = useState([])
  const [cards, setCards] = useState([])

  const [manaCurve, setManaCurve] = useState()

  const [tagCount, setTagCount] = useState(Object.keys(tags).map(_ => 0))

  const initializeState = () => {
    setPendingCard(false)
    setOptions([])
    setCards([])
    setTagCount(Object.keys(tags).map(_ => 0))
    setManaCurve({
      [types.CREATURE]: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [types.SPELL]: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
  }

  const setDraftStats = (cards) => {
    let copy = {
      [types.CREATURE]: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [types.SPELL]: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    let currentTagCount = [...tagCount]

    cards.map(card => {
      if (card.cost > 7) {
        copy[card.type][8] += 1;
      } else {
        copy[card.type][card.cost] += 1;
      }

      currentTagCount[Object.values(tags).indexOf(card.tag)] += 1
    })

    setManaCurve(copy)
    setTagCount(currentTagCount)
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

    const res = await dojo.executeTx("game_systems", "start_game", [playerName ?? 'Anonymous'])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const entropy = res.find(e => e.componentName === 'Entropy')

      game.setGameEntropy(entropy)
      game.setGame(gameValues)
    }
  }

  const getDraftOptions = async () => {
    const res = await dojo.executeTx("draft_systems", "get_draft_options", [game.values.gameId, game.entropy.blockHash])

    if (res) {
      const draftOptions = res.filter(e => e.componentName === 'DraftOption')

      setOptions(draftOptions.map(option => CARD_DETAILS(option.cardId, option.optionId, option.level)))
    }
  }

  const selectCard = async (card) => {
    if (pendingTx) return;

    setPendingCard(card.id)

    const res = await dojo.executeTx("draft_systems", "pick_card", [game.values.gameId, card.id])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftCard = res.find(e => e.componentName === 'DraftCard')

      setOptions([])

      card.id = draftCard.number;
      setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
      updateDraftStats(card)

      if (gameValues) {
        game.setGame(gameValues)
      }

      const entropy = res.find(e => e.componentName === 'Entropy')
      game.setGameEntropy(entropy)
    }

    setPendingCard()
  }

  const fetchDraftCards = async (gameId, inDraft) => {
    let data = await getDraftCards(gameId)

    let cards = data.map(card => CARD_DETAILS(card.card_id, card.number, card.level))

    setDraftStats(cards)
    setCards(cards.sort((a, b) => a.cost - b.cost))

    if (inDraft) {
      const entropy = await getEntropy(gameId, data.length + 1)

      game.setGameEntropy({
        blockNumber: parseInt(entropy.block_number)
      })
    }
  }

  const levelUpCards = async () => {
    setCards(cards.map(card => ({
      ...card,
      level: Math.min(15, card.level + 1)
    })))
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
        pendingCard,
        getDraftOptions,
        setPlayerName,
        playerName,
        fetchDraftCards,
        levelUpCards
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};