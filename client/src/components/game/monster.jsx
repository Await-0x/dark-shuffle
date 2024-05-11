import { motion, useAnimationControls } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useRef } from "react";
import skullAnim from "../../assets/animations/skull.json";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from "../../contexts/battleContext";
import Bigfoot from './monsters/bigfoot';
import Chimera from './monsters/chimera';
import Kappa from './monsters/kappa';
import Lich from './monsters/lich';
import Minotaur from './monsters/minotaur';
import Spider from './monsters/spider';
import Troll from './monsters/troll';

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
    style: { height: '200px', width: '200px' },
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
      return battle.attack(attackingCreature)
    }
  }

  return <>
    <motion.div
      layout
      onMouseUp={(event) => mouseUpHandler(event)}
      animate={controls}
      ref={ref}
    >

      <motion.div animate={skullControls} style={{ left: 'calc(50% - 100px)', top: '100px', position: 'absolute', opacity: monster.health > 0 ? 0 : 1 }}>
        {skull.View}
      </motion.div>

      {monster.health > 0 && <>
        {monster.id === 401 && <Minotaur monster={monster} />}
        {monster.id === 402 && <Troll monster={monster} />}
        {monster.id === 403 && <Bigfoot monster={monster} />}
        {monster.id === 404 && <Chimera monster={monster} />}
        {monster.id === 405 && <Kappa monster={monster} />}
        {monster.id === 406 && <Spider monster={monster} />}
        {monster.id === 407 && <Lich monster={monster} />}
      </>}

    </motion.div>
  </>
}

export default Monster

const styles = {
}