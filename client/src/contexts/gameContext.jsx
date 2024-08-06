import React, { createContext, useContext, useState } from "react";
import { getBlockWithTxs, getLatestBlock } from "../api/starknet";
import { GAME_EFFECTS } from "../helpers/constants";
import { delay, getNodeStatus } from "../helpers/utilities";
import { DojoContext } from "./dojoContext";

export const GameContext = createContext()

const GAME_VALUES = {
  gameId: null,
  inDraft: false,
  inBattle: false,
  name: 'Await'
}

export const GameProvider = ({ children }) => {
  const dojo = useContext(DojoContext)

  const [values, setValues] = useState({ ...GAME_VALUES })
  const [gameEffects, setGameEffects] = useState({ ...GAME_EFFECTS })
  const [nodes, setNodes] = useState([])

  const [entropy, setEntropy] = useState({
    blockNumber: null,
    blockHash: null
  })

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

  const setGameEntropy = (gameEntropy) => {
    if (!gameEntropy) return;

    setEntropy({
      blockNumber: gameEntropy.blockNumber,
      blockHash: null
    })

    fetchBlockHash(gameEntropy.blockNumber);
  }

  const fetchBlockHash = async (blockNumber) => {
    let latestBlock = await getLatestBlock()

    if (latestBlock?.block_number === blockNumber) {
      return setEntropy(prev => ({
        ...prev,
        blockHash: latestBlock.block_hash
      }))
    }

    if (latestBlock?.block_number > blockNumber) {
      return specificBlockHash(blockNumber)
    }

    await delay(1000);
    return fetchBlockHash(blockNumber);
  }

  const specificBlockHash = async (blockNumber) => {
    let block = await getBlockWithTxs(blockNumber)

    if (block?.block_hash) {
      return setEntropy(prev => ({
        ...prev,
        blockHash: block.block_hash
      }))
    }

    await delay(1000);
    return specificBlockHash(blockNumber);
  }

  const updateNodeStatus = (nodeId, status) => {
    setNodes(prev => {
      let newNodes = prev.map(node => ({ ...node, status: node.nodeId === nodeId ? status : node.status }))
      return newNodes.map(node => ({ ...node, active: getNodeStatus(newNodes, node) }))
    });
  }

  const selectNode = async (nodeId) => {
    const res = await dojo.executeTx("node_systems", "select_node", [nodeId])

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')
      let node = res.find(e => e.componentName === 'Node')

      if (node?.status) {
        updateNodeStatus(node.nodeId, node.status);
      }

      if (gameValues) {
        setGame(gameValues);
      }
    }

    return res;
  }

  const skipNode = async (nodeId) => {
    const res = await dojo.executeTx("node_systems", "skip_node", [nodeId]);

    if (res) {
      const node = res.find(e => e.componentName === 'Node');
      const gameValues = res.find(e => e.componentName === 'Game');

      updateNodeStatus(node.nodeId);
      setGame(gameValues);
    }
  }

  const generateNodes = async () => {
    const res = await dojo.executeTx("node_systems", "generate_tree", [values.gameId, entropy.blockHash]);

    if (res) {
      const nodes = res.filter(e => e.componentName === 'Node')
      const monsterNodes = res.filter(e => e.componentName === 'MonsterNode')
      const potionNodes = res.filter(e => e.componentName === 'PotionNode')
      const gameValues = res.find(e => e.componentName === 'Game')

      let computedNodes = nodes.map(node => {
        let nodeDetails = null

        if (node.nodeType === 1) {
          nodeDetails = { ...monsterNodes.find(n => n.nodeId === node.nodeId), type: 'monster' }
        } else if (node.nodeType === 2 || node.nodeType === 3) {
          nodeDetails = { ...potionNodes.find(n => n.nodeId === node.nodeId), type: node.nodeType === 2 ? 'potion' : 'energy' }
        }

        return { ...node, ...nodeDetails, active: getNodeStatus(nodes, node) }
      });

      setNodes(computedNodes.sort((a, b) => a.level - b.level));
      setGame(gameValues);
    }
  }

  return (
    <GameContext.Provider
      value={{
        values,
        score,
        entropy,
        clientOnly,
        gameEffects,
        nodes,

        setGame,
        endGame,
        setClientOnly,
        setGameEntropy,
        setScore,
        setGameEffects,
        setNodes,

        actions: {
          selectNode,
          skipNode,
          generateNodes,
          updateNodeStatus
        }
      }}
    >
      {children}
    </GameContext.Provider>
  );
};