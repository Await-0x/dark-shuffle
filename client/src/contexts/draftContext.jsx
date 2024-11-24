import { getContractByName } from "@dojoengine/core";
import React, { createContext, useContext, useState } from "react";
import { dojoConfig } from "../../dojo.config";
import { getDraft } from "../api/indexer";
import { CARD_DETAILS } from "../helpers/cards";
import { DojoContext } from "./dojoContext";
import { GameContext } from "./gameContext";
import { useSeason } from "./seasonContext";
import { delay } from "../helpers/utilities";

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

    const res = await dojo.executeTx(txs, isDemo, true)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const draftValues = res.find(e => e.componentName === 'Draft')

      game.setGame(gameValues)
      setOptions(draftValues.options.map(option => CARD_DETAILS(option)))
    }
  }

  const selectCard = async (optionId) => {
    setPendingCard(optionId)

    if (game.values.isDemo) {
      await delay(500)
    }

    const res = await dojo.executeTx([{ contractName: "draft_systems", entrypoint: "pick_card", calldata: [game.values.gameId, optionId] }], game.values.isDemo, true)

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

  const fetchDraft = async (gameId) => {
    let data = await getDraft(gameId);

    setCards(data.cards.map(card => CARD_DETAILS(card)))
    setOptions(data.options.map(option => CARD_DETAILS(option)))
  }

  return (
    <DraftContext.Provider
      value={{
        actions: {
          startDraft,
          selectCard,
          fetchDraft
        },

        getState: {
          cards,
          options,
          pendingCard,
          playerName,
        },

        setState: {
          name: setPlayerName,
        }
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};