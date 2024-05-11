import { motion, useAnimationControls } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { AnimationContext } from "../../contexts/animationHandler";

function DamageEffectAnimation(props) {
  const { animation } = props

  const animationHandler = useContext(AnimationContext)

  const controls = useAnimationControls()

  useEffect(() => {
    startAnimation()

    return () => {
      controls.stop();
      animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'damageEffect' && x.creatureId !== animation.creatureId));
    }
  }, [])

  const startAnimation = async () => {
    const { creatureId, position, targetPosition, damageAmount } = animation

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y
    })

    animationHandler.animationCompleted({ type: 'damageEffect', creatureId, damage: damageAmount })
  }

  return <>
    <motion.div
      className='shooting_star'
      animate={controls}
    >
    </motion.div>
  </>
}

export default DamageEffectAnimation