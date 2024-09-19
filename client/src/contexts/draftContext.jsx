import React, { createContext, useContext, useState } from "react";
import { getDraftCards, getEntropy } from "../api/indexer";
import { CARD_DETAILS, tags, types } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";
import { DECK_SIZE } from "../helpers/constants";
import { useEffect } from "react";
import { dojoConfig } from "../../dojo.config";

export const DraftContext = createContext()

export const DraftProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)

  const [pendingTx, setPendingTx] = useState()
  const [pendingCard, setPendingCard] = useState()

  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') ?? '')
  const [options, setOptions] = useState([])
  const [cards, setCards] = useState([])
  const [bench, setBench] = useState([])
  const [battleCards, setBattleCards] = useState()

  const [manaCurve, setManaCurve] = useState()
  const [tagCount, setTagCount] = useState(Object.keys(tags).map(_ => 0))

  useEffect(() => {
    if (cards.length > 0 && battleCards) {
      setDeckFromGraph(battleCards)
      setBattleCards()
    }
  }, [battleCards, cards])

  const initializeState = () => {
    setPendingCard(false)
    setOptions([])
    setCards([])
    setBench([])
    setTagCount(Object.keys(tags).map(_ => 0))
    setManaCurve({
      [types.CREATURE]: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [types.SPELL]: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
  }

  const setDeckFromGraph = (cardIds) => {
    let allCards = [...cards, ...bench]

    setCards(allCards.filter(card => cardIds.includes(card.id)))
    setBench(allCards.filter(card => !cardIds.includes(card.id)))
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

  const startDraft = async (isDemo) => {
    initializeState()

    game.setGame({ isDemo })

    const res = await dojo.executeTx("game_systems", "start_game", [dojoConfig.season, playerName ?? 'Anonymous'], isDemo)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const entropy = res.find(e => e.componentName === 'Entropy')

      game.setGameEntropy(entropy)
      game.setGame(gameValues)
    }
  }

  const getDraftOptions = async () => {
    const res = await dojo.executeTx("draft_systems", "get_draft_options", [game.values.gameId, game.entropy.blockHash], game.values.isDemo)

    if (res) {
      const draftOptions = res.filter(e => e.componentName === 'DraftOption')
      setOptions(draftOptions.map(option => CARD_DETAILS(option.cardId, option.optionId, option.level)))

      const entropy = res.find(e => e.componentName === 'Entropy')
      game.setGameEntropy(entropy)
    }
  }

  const selectCard = async (card) => {
    if (pendingTx) return;

    setPendingCard(card.id)

    const res = await dojo.executeTx("draft_systems", "pick_card", [game.values.gameId, card.id], game.values.isDemo)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftCard = res.find(e => e.componentName === 'DraftCard')

      setOptions([])

      card.id = draftCard.number;

      if (cards.length < DECK_SIZE) {
        setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
      } else {
        setBench(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
      }

      updateDraftStats(card)

      if (gameValues) {
        game.setGame(gameValues)
      }
    }

    setPendingCard()
  }

  const fetchDraftCards = async (gameId, inDraft) => {
    let data = await getDraftCards(gameId);

    let cards = data.map(card => CARD_DETAILS(card.card_id, card.number, card.level));
    setDraftStats(cards);

    setCards(cards.slice(0, 5).sort((a, b) => a.cost - b.cost));
    setBench(cards.slice(5).sort((a, b) => a.cost - b.cost));

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

  const addCardToDeck = (cardNumber) => {
    let card = bench.find(card => card.id === cardNumber)

    if (!card) return;

    setCards(prev => [...prev, card])
    setBench(prev => prev.filter(card => card.id !== cardNumber))
  }

  const removeCardFromDeck = (cardNumber) => {
    let card = cards.find(card => card.id === cardNumber)

    if (!card) return;

    setBench(prev => [...prev, card])
    setCards(prev => prev.filter(card => card.id !== cardNumber))
  }

  const addNodeCard = (draftCard) => {
    let card = CARD_DETAILS(draftCard.cardId, draftCard.number, draftCard.level)

    if (cards.length < DECK_SIZE) {
      setCards(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
    } else {
      setBench(prev => [...prev, card].sort((a, b) => a.cost - b.cost))
    }
  }

  return (
    <DraftContext.Provider
      value={{
        cards,
        options,
        manaCurve,
        tagCount,
        pendingTx,
        pendingCard,
        playerName,
        bench,

        selectCard,
        setOptions,
        startDraft,
        getDraftOptions,
        setPlayerName,
        fetchDraftCards,
        levelUpCards,
        addCardToDeck,
        removeCardFromDeck,
        setDeckFromGraph,
        addNodeCard,
        setBattleCards
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};