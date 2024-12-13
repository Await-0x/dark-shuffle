import FavoriteIcon from '@mui/icons-material/Favorite';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import vortexAnim from "../assets/animations/vortex.json";
import bolt from "../assets/images/bolt.png";
import monarch from "../assets/images/monarch.png";
import Battlefield from '../components/battle/battlefield';
import GameEffects from '../components/battle/gameEffects';
import Hand from '../components/battle/hand';
import RestoringBattleDialog from '../components/dialogs/restoringBattle';
import { BattleContext } from '../contexts/battleContext';
import { GameContext } from '../contexts/gameContext';
import { CustomTooltip } from '../helpers/styles';
import { fadeVariant } from "../helpers/variants";

function BattleContainer() {
  const game = useContext(GameContext)
  const { gameSettings } = game.getState

  const battle = useContext(BattleContext)

  const vortex = useLottie({
    animationData: vortexAnim,
    loop: true
  });

  const anyActionsLeft = battle.state.hand.find(card => battle.utils.getCardCost(card) <= battle.state.values.heroEnergy)

  if (isMobile) {
    return <Box style={styles.mobileContainer}>
      <Box style={styles.mobileBoard}>
        <Battlefield />

        <Box sx={{ position: 'absolute', right: '20px' }}>
          <CustomTooltip title={<Box mb={1}>
            <Typography color="primary">End Turn</Typography>
            <Typography mt={0.5}>Your creatures attack. Monster perform its ability and attack. Yoy replenish energy.</Typography>
          </Box>
          }>
            <LoadingButton variant='outlined' size='medium' sx={{ fontSize: '12px', letterSpacing: '1px' }}
              loading={battle.state.pendingTx}
              onClick={() => battle.actions.endTurn()}
            >
              End Turn
            </LoadingButton>
          </CustomTooltip>
        </Box>

      </Box>
      <Box sx={[styles.playerContainer, { px: 0.5, height: '25%' }]}>

        <Box width={'150px'} height={'100%'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <img alt='' src={monarch} height={'58%'} />

          <Box width={'100%'} display={'flex'} gap={0.5} justifyContent={'center'}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5">
                {battle.state.values.heroEnergy}
              </Typography>

              <img alt='' src={bolt} height={21} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5">
                {battle.state.values.heroHealth}
              </Typography>

              <FavoriteIcon htmlColor="red" fontSize='small' />
            </Box>
          </Box>

        </Box>

        <Box sx={[styles.hand, { flex: 1 }]}>

          <Hand />

        </Box>

        <Box sx={[styles.utContainer, { pr: 0 }]}>
        </Box>

      </Box>
    </Box>
  }

  return (
    <motion.div style={styles.container} variants={fadeVariant} initial='initial' exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.board}>
          <Battlefield />

          <Box sx={{ position: 'absolute', right: '20px' }}>
            <CustomTooltip title={<Box mb={1}>
              <Typography color="primary">End Turn</Typography>
              <Typography mt={0.5}>- Your creatures attack.<br />- Monster perform its ability and attack.<br />- You replenish energy.</Typography>
            </Box>
            }>
              <LoadingButton variant='outlined' size='large' sx={[styles.endTurnButton, { opacity: anyActionsLeft ? 0.8 : 1, animation: anyActionsLeft ? '' : 'animateGlowSmall 2s linear infinite' }]}
                loading={battle.state.pendingTx}
                onClick={() => battle.actions.endTurn()}
              >
                End Turn
              </LoadingButton>
            </CustomTooltip>
          </Box>
        </Box>

        <Box sx={[styles.playerContainer, { height: '144px' }]}>

          <Box width={'232px'} display={'flex'} justifyContent={'center'}>

            <CustomTooltip title={
              <Box mb={1}>
                <Typography color="primary" variant='h6'>Deck</Typography>
                <Typography mt={0.5}>You draw a random card at the start of each turn.</Typography>
              </Box>
            }>
              <Box sx={styles.deck}>
                <Box sx={styles.cardCount}>
                  <Typography>
                    {gameSettings.deck_size - (battle.state.values?.deckIndex || 0)}
                  </Typography>
                </Box>
              </Box>
            </CustomTooltip>

          </Box>

          <Box sx={[styles.hand, { width: '800px' }]}>

            <Hand />

          </Box>

          <GameEffects />

        </Box>

      </Box >

      {battle.state.resettingState && <RestoringBattleDialog />}
    </motion.div>
  )
}

export default BattleContainer

const styles = {
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },

  mobileContainer: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  },

  mobileBoard: {
    height: '75%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },

  board: {
    height: 'calc(100% - 200px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },

  playerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    px: 2,
    alignItems: 'center',
    boxSizing: 'border-box'
  },

  hand: {
    height: '100%',
  },

  utContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    pr: 2,
    gap: 3
  },

  deck: {
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    height: '80px',
    width: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    boxShadow: `rgba(255, 233, 127, 0.35) 0px 5px 15px`,
    animation: 'animateGlowSmall 2s linear infinite',
    cursor: 'pointer'
  },

  cardCount: {
    width: '32px',
    height: '32px',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },

  kingContainer: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  endTurnButton: {
    fontSize: '16px',
    letterSpacing: '1px',
  }
}
