import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext } from 'react';
import vortexAnim from "../assets/animations/vortex.json";
import Battlefield from '../components/battle/battlefield';
import Hand from '../components/battle/hand';
import { BattleContext } from '../contexts/battleContext';
import { CustomTooltip } from '../helpers/styles';
import { fadeVariant } from "../helpers/variants";
import graveyardIcon from '../assets/images/graveyard.png';
import RestoringBattleDialog from '../components/dialogs/restoringBattle';
import { GameContext } from '../contexts/gameContext';

function BattleContainer() {
  const game = useContext(GameContext)
  const battle = useContext(BattleContext)

  const vortex = useLottie({
    animationData: vortexAnim,
    loop: true
  });

  const mouseUpHandler = (event) => {
    if (battle.state.targetFriendlyCreature) {
      if (event.button === 2) {
        battle.utils.setTargetFriendly()
        event.preventDefault()
      }
    }
  }

  return (
    <motion.div style={styles.container} variants={fadeVariant} initial='initial' exit='exit' animate='enter' onMouseUp={(event) => mouseUpHandler(event)}>
      <Box sx={styles.container}>

        <Box sx={styles.board}>
          <Battlefield />

          <Box sx={{ position: 'absolute', right: '20px' }}>
            <CustomTooltip title={<Box mb={1}>
              <Typography color="primary" variant='h6'>End Turn</Typography>
              <Typography mt={0.5}>Monster perform its ability and attack. Replenish energy.</Typography>
            </Box>
            }>
              <LoadingButton variant='outlined' size='large' sx={{ fontSize: '16px', letterSpacing: '1px' }}
                loading={battle.state.pendingTx}
                onClick={() => battle.actions.endTurn()}
              >
                END TURN
              </LoadingButton>
            </CustomTooltip>
          </Box>
        </Box>

        <Box sx={styles.playerContainer}>

          <Box width={'232px'} display={'flex'} justifyContent={'center'}>

            <CustomTooltip title={
              <Box mb={1}>
                <Typography color="primary" variant='h6'>Deck ({battle.state.deckIteration})</Typography>
                <Typography mt={0.5}>Draw new set of cards if your hand is empty.</Typography>
              </Box>
            }>
              <Box sx={styles.deck}>
                <Box sx={styles.cardCount}>
                  <Typography>
                    {battle.state.deckIteration}
                  </Typography>
                </Box>
              </Box>
            </CustomTooltip>

          </Box>

          <Box sx={styles.hand}>

            <Hand />

          </Box>

          <Box sx={styles.utContainer}>

            <CustomTooltip title={
              <Box mb={1} minWidth={'130px'}>
                <Typography color="primary" variant='h6' mb={1}>Graveyard</Typography>

                <Typography variant='h6'>
                  {`Discarded: ${game.gameEffects.cardsDiscarded}`}
                </Typography>

                <Typography variant='h6'>
                  {`Creatures: ${game.gameEffects.deadCreatures}`}
                </Typography>

                <Typography variant='h6'>
                  {`Spells: ${game.gameEffects.spellsPlayed}`}
                </Typography>
              </Box>
            }>
              <img src={graveyardIcon} alt='' width={84} />
            </CustomTooltip>

            <CustomTooltip title={
              <Box mb={1}>
                <Typography color="primary" variant='h6'>Vortex</Typography>
                <Typography mt={0.5}>Drag cards to the vortex to discard them from your hand. Costs (1) energy.</Typography>
              </Box>
            }>
              <Box width='140px'>
                {vortex.View}
              </Box>
            </CustomTooltip>

          </Box>

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
    height: '144px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    px: 2,
    alignItems: 'center'
  },

  hand: {
    height: '100%',
    width: '800px',
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
    animation: 'animateGlow 2.5s linear infinite',
    cursor: 'pointer'
  },

  graveyard: {
    background: '#3c0505b8',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    height: '70px',
    width: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
  },

  cardCount: {
    width: '32px',
    height: '32px',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }
}