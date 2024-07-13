import { Box } from '@mui/material';
import { motion } from "framer-motion";
import React, { useContext } from 'react';
import HeroStats from '../components/draft/heroStats';
import Overview from '../components/draft/overview';
import Structure from '../components/gametree/structure';
import { BattleContext } from '../contexts/battleContext';
import { GameContext } from '../contexts/gameContext';
import { fadeVariant } from "../helpers/variants";

function StartBattleContainer() {
  const game = useContext(GameContext)
  const battle = useContext(BattleContext)

  return (
    <motion.div style={styles.container} variants={fadeVariant} initial='initial' exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.draftContainer}>

          <Structure />

        </Box>

        <Box sx={styles.overview}>

          <Overview />

          <HeroStats />

        </Box>

      </Box >
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