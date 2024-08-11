import { motion, useAnimationControls } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useRef } from "react";
import skullAnim from "../../assets/animations/skull.json";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from "../../contexts/battleContext";
import DamageAnimation from '../animations/damageAnimation';
import Bigfoot from './monsters/bigfoot';
import Chimera from './monsters/chimera';
import Kappa from './monsters/kappa';
import Lich from './monsters/lich';
import Minotaur from './monsters/minotaur';
import Spider from './monsters/spider';
import Troll from './monsters/troll';
import { isMobile, isBrowser } from 'react-device-detect';
import { MONSTER_LIST } from "../../battle/monsterUtils";
import { CustomTooltip } from "../../helpers/styles";
import { Box } from "@mui/material";

function Monster(props) {
  const battle = useContext(BattleContext)
  const animationHandler = useContext(AnimationContext)

  const { monster, attackingCreature } = props

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
    ref.current.style.background = 'black'

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y,
      zIndex: 100
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

  const mouseUpHandler = (event) => {
    if (!attackingCreature) {
      return
    }

    animationHandler.addAnimation('monster', { type: 'defend' })

    if (attackingCreature) {
      return battle.actions.attack(attackingCreature)
    }
  }

  let damage = animationHandler.state.animations.monsterDamaged

  return <>
    <motion.div
      layout
      onMouseUp={(event) => mouseUpHandler(event)}
      animate={controls}
      ref={ref}
      style={isMobile ? { position: 'relative', width: '120px', height: '120px' } : { position: 'relative', width: '200px', height: '200px' }}
    >

      {(damage && monster.health > 0) && <DamageAnimation id={'monsterDamaged'} damage={damage} />}

      <motion.div animate={skullControls} style={{ left: isMobile ? 'calc(50% - 60px)' : 'calc(50% - 100px)', top: 0, position: 'absolute', opacity: monster.health > 0 ? 0 : 1 }}>
        {skull.View}
      </motion.div>

      {monster.health > 0 && <CustomTooltip position={'right'} title={<Box mb={1}>
        {MONSTER_LIST.find(m => m.monsterId === monster.id).abilities}
      </Box>}>
        {monster.id === 1 && <Minotaur monster={monster} />}
        {monster.id === 2 && <Troll monster={monster} />}
        {monster.id === 3 && <Bigfoot monster={monster} />}
        {monster.id === 4 && <Chimera monster={monster} />}
        {monster.id === 5 && <Kappa monster={monster} />}
        {monster.id === 6 && <Spider monster={monster} />}
        {monster.id === 7 && <Lich monster={monster} />}
      </CustomTooltip>}

    </motion.div>
  </>
}

export default Monster

const styles = {
}