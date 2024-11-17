import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Box, IconButton } from '@mui/material';
import { motion } from "framer-motion";
import React, { useContext, useEffect } from 'react';
import BlockRevealAnimation from '../components/animations/blockRevealAnimation';
import HeroStats from '../components/draft/heroStats';
import Overview from '../components/draft/overview';
import Structure from '../components/gametree/structure';
import { BattleContext } from '../contexts/battleContext';
import { GameContext } from '../contexts/gameContext';
import { fadeVariant } from "../helpers/variants";
import { BrowserView, MobileView, isMobile } from 'react-device-detect'
import { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { DraftContext } from '../contexts/draftContext';
import { useSnackbar } from 'notistack';

function StartBattleContainer() {
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)
  const battle = useContext(BattleContext)

  const { enqueueSnackbar } = useSnackbar()
  const [cardOverview, setCardOverview] = useState(false)

  useEffect(() => {
    if (game.values.mapDepth === 6) {
      game.actions.generateNodes()
    }
  }, [game.values.mapDepth])

  const selectNode = async (nodeId, type) => {
    if (type === 'battle' && draft.cards.length !== 5) {
      return enqueueSnackbar('Deck must have 5 cards', { variant: 'warning' })
    }

    const res = await game.actions.selectNode(nodeId, draft.cards.map(card => card.id))

    if (!res) return;

    const battleValues = res.find(e => e.componentName === 'Battle')
    if (battleValues) {
      battle.actions.startBattle(battleValues)
    }

    const cardValue = res.find(e => e.componentName === 'DraftCard')
    if (cardValue) {
      draft.addNodeCard(cardValue)
    }
  }

  return (
    <motion.div style={styles.container} variants={fadeVariant} initial='initial' exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={isMobile ? styles.mobileDraftContainer : styles.draftContainer}>

          {(game.values.nodeLevel === 6 || game.nodes.length === 0)
            ? <Box mt={10}><BlockRevealAnimation icon /></Box>
            : <Structure selectNode={selectNode} />
          }

        </Box>

        <BrowserView>
          <Box sx={styles.overview}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>

              <Overview />

              <HeroStats />

            </Scrollbars>
          </Box>
        </BrowserView>

        <MobileView>
          {!cardOverview && <Box sx={styles.mobileOverview} width={'55px'}>

            <IconButton onClick={() => setCardOverview(true)}>
              <WestIcon htmlColor='white' />
            </IconButton>

            <HeroStats compact={true} />

          </Box>}

          {cardOverview && <Box sx={styles.mobileOverview} width={'280px'}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>

              <IconButton onClick={() => setCardOverview(false)} sx={{ ml: 1 }}>
                <EastIcon htmlColor='white' />
              </IconButton>

              <Overview />

              <HeroStats />

            </Scrollbars>
          </Box>}
        </MobileView>

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

  mobileOverview: {
    height: 'calc(100vh - 55px)',
    pt: '40px',
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
  },

  mobileDraftContainer: {
    height: '100%',
    width: 'calc(100% - 50px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
    overflow: 'auto',
    boxSizing: 'border-box',
  }
}