import { Box } from "@mui/material";
import React, { useContext, useState } from "react";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from '../../contexts/battleContext';
import { GameContext } from "../../contexts/gameContext";
import DamageEffectAnimation from '../animations/damageEffectAnimation';
import PoisonSprayAnimation from "../animations/poisonSprayAnimation";
import Adventurer from './adventurer';
import Arrow from "./arrow";
import Creature from "./creature";
import DeathDialog from './death';
import Monster from "./monster";

function Battlefield(props) {
  const animationHandler = useContext(AnimationContext)
  const game = useContext(GameContext)
  const battle = useContext(BattleContext)
  const [arrow, showArrow] = useState(false)

  const [attackingCreature, setAttackingCreature] = useState()

  const startAttack = (creature, arrow) => {
    if (creature.resting) { return }

    setAttackingCreature(creature)
    showArrow(arrow)
  }

  const cancelAttack = () => {
    setAttackingCreature()
    showArrow(false)
  }

  return <Box sx={styles.container}>

    {game.score && <DeathDialog />}

    {arrow && <Arrow arrow={arrow} cancel={cancelAttack} />}

    <Box sx={styles.enemyContainer}>

      <Monster monster={battle.state.monster} attackingCreature={attackingCreature} />

    </Box>

    <Box sx={styles.myContainer}>

      {React.Children.toArray(
        battle.state.board.map((creature, i) => {
          return <Creature
            pos={i}
            creature={creature}
            startAttack={startAttack}
            attacking={attackingCreature}
          />
        })
      )}

    </Box>

    <Box sx={styles.kingContainer}>

      <Adventurer />

    </Box >

    {/* {React.Children.toArray(
      animationHandler.creatureAnimations.filter(x => x.type === 'death').map(animation => <StarAnimation
        id={animation.id}
        left={animation.position.x}
        bottom={animation.position.y}
      />)
    )} */}

    {React.Children.toArray(
      animationHandler.creatureAnimations.filter(x => x.type === 'damageEffect').map(animation => <DamageEffectAnimation
        animation={animation}
      />)
    )}

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
    height: '90%',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  enemyContainer: {
    width: '100%',
    height: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  myContainer: {
    width: '100%',
    height: '35%',
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
  },
  king: {
    width: '200px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    pt: 2,
    gap: 1,
    position: 'relative'
  }
}