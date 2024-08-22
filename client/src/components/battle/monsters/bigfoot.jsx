import { motion, useAnimationControls } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { AnimationContext } from '../../../contexts/animationHandler';
import MonsterMain from './main';

function Bigfoot(props) {
  const animationHandler = useContext(AnimationContext)
  const controls = useAnimationControls()

  const { monster } = props

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))
      animationHandler.animationCompleted({ type: 'monsterAbility' })
    }

    if (animation.type === 'defend') {
      showShield()
    }
  }, [animationHandler.monsterAnimations])

  async function showShield() {
    await controls.start({
      opacity: [0, 1, 1, 1, 0],
    })

    animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'defend'))
  }

  return <>
    <motion.div animate={controls} style={styles.armor} />

    <MonsterMain monster={monster} />
  </>
}

export default Bigfoot

const styles = {
  armor: {
    bottom: '50px',
    left: '35px',
    position: 'absolute',
    width: '130px',
    height: '80px',
    borderRadius: '50%',
    boxShadow: '1px 10px 5px -3px #b2b3b7',
    opacity: 0
  }
}