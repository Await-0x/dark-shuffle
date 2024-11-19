import { getContractByName } from "@dojoengine/core";
import React, { createContext, useContext, useState } from "react";
import { dojoConfig } from "../../dojo.config";
import { getDraftCards } from "../api/indexer";
import { CARD_DETAILS } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";
import { useSeason } from "./seasonContext";

export const DraftContext = createContext()

export const DraftProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const season = useSeason()

  const [pendingCard, setPendingCard] = useState()

  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') ?? '')
  const [options, setOptions] = useState([])
  const [cards, setCards] = useState([])

  const initializeState = () => {
    setPendingCard()
    setOptions([])
    setCards([])
  }

  const startDraft = async (isDemo) => {
    initializeState()

    const txs = []
    if (!isDemo) {
      txs.push({
        contractAddress: dojoConfig.lordsAddress,
        entrypoint: "approve",
        calldata: [getContractByName(dojoConfig.manifest, "darkshuffle", "game_systems")?.address, season.values.entryFee, "0"]
      })
    }

    txs.push({
      contractName: "game_systems",
      entrypoint: "start_game",
      calldata: [dojoConfig.seasonId, '0x' + (playerName || 'Demo').split('').map(char => char.charCodeAt(0).toString(16)).join('')]
    })

    const res = await dojo.executeTx(txs, isDemo)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftValues = res.find(e => e.componentName === 'Draft')

      game.setGame(gameValues)
      setOptions(draftValues.options.map(option => CARD_DETAILS(option)))
    }
  }

  const selectCard = async (optionId) => {
    setPendingCard(optionId)

    const res = await dojo.executeTx([{ contractName: "draft_systems", entrypoint: "pick_card", calldata: [game.values.gameId, optionId] }], game.values.isDemo)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftValues = res.find(e => e.componentName === 'Draft')

      setCards(draftValues.cards.map(card => CARD_DETAILS(card)))
      setOptions(draftValues.options.map(option => CARD_DETAILS(option)))

      if (gameValues) {
        game.setGame(gameValues)
      }
    }

    setPendingCard()
  }

  const fetchDraftCards = async (gameId, inDraft) => {
    let data = await getDraftCards(gameId);

    let cards = data.map(card => CARD_DETAILS(card.cardId, card.number));
    setDraftStats(cards);

    setCards(cards.slice(0, 5).sort((a, b) => a.cost - b.cost));
  }

  return (
    <DraftContext.Provider
      value={{
        actions: {
          startDraft,
          selectCard,
        },

        getState: {
          cards,
          options,
          pendingCard,
          playerName,
        },

        setState: {
          setPlayerName,
        }
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};