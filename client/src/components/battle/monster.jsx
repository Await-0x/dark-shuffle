import { Box } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useRef } from "react";
import { isMobile } from 'react-device-detect';
import skullAnim from "../../assets/animations/skull.json";
import { AnimationContext } from '../../contexts/animationHandler';
import { CustomTooltip } from "../../helpers/styles";
import DamageAnimation from '../animations/damageAnimation';
import * as Monsters from './monsters';
import { delay } from "../../helpers/utilities";
import { useState } from "react";

function Monster(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props

  const [health, setHealth] = useState(monster.health)
  const [damageTaken, setDamageTaken] = useState(0)

  const controls = useAnimationControls()
  const skullControls = useAnimationControls()
  const ref = useRef()

  const skull = useLottie({
    animationData: skullAnim,
    loop: false,
    autoplay: false,
    style: isMobile ? { height: '120px', width: '120px' } : { height: '200px', width: '200px' },
    onComplete: () => skull.stop()
  });

  useEffect(() => {
    if (monster.health <= 0) {
      fadeSkull()
      skull.play()
    }

    else if (monster.health < health) {
      setDamageTaken(health - monster.health)
      setHealth(monster.health)
    }
  }, [monster.health])

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'attack') {
      attackAnimation(animation)
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'attack'))
    }
  }, [animationHandler.monsterAnimations])

  const fadeSkull = async () => {
    await skullControls.start({
      opacity: 0,
      transition: { duration: 2, delay: 1 }
    })
  }

  const attackAnimation = async (animation) => {
    const { position, targetPosition } = animation
    await delay(500)

    ref.current.style.background = 'black'

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y,
      zIndex: 100,
    })

    controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      zIndex: 0
    })


    ref.current.style.background = 'none'
    animationHandler.animationCompleted({ type: 'monsterAttack' })
  }

  let MonsterComponent = Monsters[monster.name]

  const mouseUpHandler = (event) => {
  }

  return <>
    <motion.div
      layout
      onMouseUp={(event) => mouseUpHandler(event)}
      animate={controls}
      ref={ref}
      style={isMobile ? { position: 'relative', width: '120px', height: '120px' } : { position: 'relative', width: '200px', height: '200px' }}
    >

      {monster.health > 0 && <DamageAnimation damage={damageTaken} />}

      <motion.div animate={skullControls} style={{ left: isMobile ? 'calc(50% - 60px)' : 'calc(50% - 100px)', top: 0, position: 'absolute', opacity: monster.health > 0 ? 0 : 1 }}>
        {skull.View}
      </motion.div>

      {monster.health > 0 && <CustomTooltip position={'right'} title={<Box my={1}>
        {monster.abilities}
      </Box>}>
        <Box sx={styles.container}>
          {MonsterComponent && <MonsterComponent monster={monster} />}
        </Box>
      </CustomTooltip>}

    </motion.div>
  </>
}

export default Monster

const styles = {
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  }
}