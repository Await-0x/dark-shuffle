import React, { createContext, useContext, useState } from "react";
import { generateMapNodes } from "../helpers/map";
import { DojoContext } from "./dojoContext";
import { useSeason } from "./seasonContext";

export const GameContext = createContext()

export const GAME_STATES = {
  0: 'Draft',
  1: 'Battle',
  2: 'Map',
  3: 'None',
}

const GAME_VALUES = {
  gameId: null,
  state: GAME_STATES[3],
}

export const GameProvider = ({ children }) => {
  const dojo = useContext(DojoContext)
  const season = useSeason()

  const [values, setValues] = useState({ ...GAME_VALUES })
  const [gameEffects, setGameEffects] = useState({})

  const [map, setMap] = useState(null)
  const [score, setScore] = useState()

  const setGame = (values) => {
    setValues(prev => ({ ...prev, ...values, state: GAME_STATES[values.state || 3] }))
  }

  const endGame = () => {
    setValues({ ...GAME_VALUES })
    setGameEffects({})
    setMap(null)
    setScore()
  }

  const mintGameToken = async () => {
    const res = await dojo.executeTx([{ contractName: "map_systems", entrypoint: "mint", calldata: [season.values.settingsId] }], true)

    if (res) {
      const config = res.find(e => e.componentName === 'WorldConfig')
      return config.game_count
    }
  }

  const updateMapStatus = (nodeId) => {
    setMap(prev => prev.map(node => {
      if (node.active && node.status !== 1 && node.nodeId !== nodeId) {
        return { ...node, active: false }
      }

      if (node.nodeId === nodeId) {
        return { ...node, status: 1, active: false }
      }

      if (node.parents.find(parent => parent === nodeId)) {
        return { ...node, active: true }
      }

      return node
    }))
  }

  const generateMap = async () => {
    const res = await dojo.executeTx([{ contractName: "map_systems", entrypoint: "generate_tree", calldata: [values.gameId] }], true);

    if (res) {
      const mapValues = res.find(e => e.componentName === 'Map')
      const gameValues = res.find(e => e.componentName === 'Game')

      const computedMap = generateMapNodes(mapValues.level, mapValues.seed)

      setMap(computedMap);
      setGame(gameValues);
    }
  }

  return (
    <GameContext.Provider
      value={{
        getState: {
          map,
          gameEffects
        },

        values,
        score,

        setGame,
        endGame,
        setScore,
        setGameEffects,
        setMap,

        actions: {
          generateMap,
          updateMapStatus,
          mintGameToken,
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
};