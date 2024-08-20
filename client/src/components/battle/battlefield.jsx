import { Box } from "@mui/material";
import React, { useContext } from "react";
import { isBrowser, isMobile } from 'react-device-detect';
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from '../../contexts/battleContext';
import { GameContext } from "../../contexts/gameContext";
import PoisonSprayAnimation from "../animations/poisonSprayAnimation";
import Adventurer from './adventurer';
import Creature from "./creature";
import DeathDialog from './death';
import Monster from "./monster";

function Battlefield(props) {
  const animationHandler = useContext(AnimationContext)
  const game = useContext(GameContext)
  const battle = useContext(BattleContext)

  return <Box sx={styles.container} height={isMobile ? '98%' : '90%'}>

    {game.score && <DeathDialog />}

    <Box sx={styles.enemyContainer} height={isMobile ? '50%' : '40%'}>

      <Monster monster={battle.state.monster} />

    </Box>

    <Box sx={styles.myContainer} height={isMobile ? '45%' : '35%'}>

      {React.Children.toArray(
        battle.state.board.map((creature, i) => {
          return <Creature
            pos={i}
            creature={creature}
          />
        })
      )}

    </Box>

    {isBrowser && <Box sx={styles.kingContainer}>

      <Adventurer />

    </Box >}

    {animationHandler.boardAnimation.length > 0 && React.Children.toArray(
      animationHandler.boardAnimation.map(animation => <PoisonSprayAnimation
        animation={animation}
      />)
    )}
  </Box >
}

export default Battlefield

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  enemyContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  myContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  targetIcon: {
    width: '35px',
    height: '35px',
    position: 'absolute',
    top: '-25px',
    left: 'calc(50%-18px)',
  },
  kingContainer: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}