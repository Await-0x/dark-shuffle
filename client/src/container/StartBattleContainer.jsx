import { Box } from '@mui/material';
import { motion } from "framer-motion";
import React, { useContext, useEffect } from 'react';
import BlockRevealAnimation from '../components/animations/blockRevealAnimation';
import HeroStats from '../components/draft/heroStats';
import Overview from '../components/draft/overview';
import Structure from '../components/gametree/structure';
import { BattleContext } from '../contexts/battleContext';
import { DraftContext } from '../contexts/draftContext';
import { GameContext } from '../contexts/gameContext';
import { fadeVariant } from "../helpers/variants";

function StartBattleContainer() {
  const game = useContext(GameContext)
  const battle = useContext(BattleContext)

  useEffect(() => {
    if (game.values.nodeLevel === 6 && game.entropy.blockHash) {
      game.actions.generateNodes()
    }
  }, [game.entropy.blockHash, game.values.nodeLevel])

  const selectNode = async (nodeId) => {
    const res = await game.actions.selectNode(nodeId)

    if (!res) return;

    const battleValues = res.find(e => e.componentName === 'Battle')
    if (battleValues) {
      battle.actions.startBattle(battleValues)
    }
  }

  return (
    <motion.div style={styles.container} variants={fadeVariant} initial='initial' exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.draftContainer}>

          {(game.values.nodeLevel === 6 || game.nodes.length === 0)
            ? <Box mt={10}><BlockRevealAnimation icon /></Box>
            : <Structure selectNode={selectNode} />
          }

        </Box>

        <Box sx={styles.overview}>

          <Overview />

          <HeroStats />

        </Box>

      </Box>
    </motion.div>
  )
}

export default StartBattleContainer

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },

  overview: {
    width: '300px',
    height: 'calc(100vh - 55px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  draftContainer: {
    height: 'calc(100% - 55px)',
    width: 'calc(100% - 300px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
    overflow: 'auto',
    boxSizing: 'border-box',
  }
}