import React, { createContext, useContext, useState } from "react";
import { GAME_EFFECTS } from "../helpers/constants";
import { getNodeStatus } from "../helpers/utilities";
import { DojoContext } from "./dojoContext";

export const GameContext = createContext()

const GAME_VALUES = {
  gameId: null,
  inDraft: false,
  inBattle: false,
}

export const GameProvider = ({ children }) => {
  const dojo = useContext(DojoContext)

  const [values, setValues] = useState({ ...GAME_VALUES })
  const [gameEffects, setGameEffects] = useState({ ...GAME_EFFECTS })

  const [nodes, setNodes] = useState([])
  const [selectingNode, setSelectingNode] = useState(false)

  const [score, setScore] = useState()

  // Client only states
  const [clientOnly, setClientOnly] = useState(false)

  const setGame = (values) => {
    setValues(prev => ({ ...prev, ...values }))
  }

  const endGame = () => {
    setValues({ ...GAME_VALUES })
    setScore()
  }

  const updateNodeStatus = (nodeId, status) => {
    setNodes(prev => {
      let newNodes = prev.map(node => ({ ...node, status: node.nodeId === nodeId ? status : node.status }))
      return newNodes.map(node => ({ ...node, active: getNodeStatus(newNodes, node) }))
    });
  }

  const selectNode = async (nodeId, deck) => {
    setSelectingNode(true)
    const res = await dojo.executeTx([{ contractName: "node_systems", entrypoint: "select_node", calldata: [nodeId, deck] }], values.isDemo)
    setSelectingNode(false)

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      const node = res.find(e => e.componentName === 'Node')

      if (node?.status) {
        updateNodeStatus(node.nodeId, node.status);
      }

      if (gameValues) {
        setGame(gameValues);
      }
    }

    return res;
  }

  const generateNodes = async () => {
    const res = await dojo.executeTx([{ contractName: "node_systems", entrypoint: "generate_tree", calldata: [values.gameId, entropy.blockHash] }], values.isDemo);

    if (res) {
      const nodes = res.filter(e => e.componentName === 'Node')
      const monsterNodes = res.filter(e => e.componentName === 'MonsterNode')
      const potionNodes = res.filter(e => e.componentName === 'PotionNode')
      const cardNodes = res.filter(e => e.componentName === 'CardNode')
      const gameValues = res.find(e => e.componentName === 'Game')

      let computedNodes = nodes.map(node => {
        let nodeDetails = null

        if (node.nodeType === 1) {
          nodeDetails = { ...monsterNodes.find(n => n.nodeId === node.nodeId), type: 'monster' }
        } else if (node.nodeType === 2 || node.nodeType === 3) {
          nodeDetails = { ...potionNodes.find(n => n.nodeId === node.nodeId), type: node.nodeType === 2 ? 'potion' : 'energy' }
        } else if (node.nodeType === 4) {
          nodeDetails = { ...cardNodes.find(n => n.nodeId === node.nodeId), type: 'card' }
        }

        return { ...node, ...nodeDetails, active: getNodeStatus(nodes, node) }
      });

      setNodes(computedNodes.sort((a, b) => a.nodeId - b.nodeId));
      setGame(gameValues);
    }
  }

  return (
    <GameContext.Provider
      value={{
        values,
        score,
        clientOnly,
        gameEffects,
        nodes,
        selectingNode,

        setGame,
        endGame,
        setClientOnly,
        setScore,
        setGameEffects,
        setNodes,

        actions: {
          selectNode,
          generateNodes,
          updateNodeStatus
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
};