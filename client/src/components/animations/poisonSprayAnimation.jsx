import { motion, useAnimationControls } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { AnimationContext } from "../../contexts/animationHandler";

function PoisonSprayAnimation(props) {
  const { animation } = props

  const animationHandler = useContext(AnimationContext)

  const controls = useAnimationControls()

  useEffect(() => {
    startAnimation()
  }, [])

  const startAnimation = async () => {
    const { position, targetPosition } = animation

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y,
      transition: { ease: "linear", duration: 1 }
    })
    
    animationHandler.animationCompleted({ type: 'monsterAbility' })
  }

  return <>
    <motion.div
      className="poison"
      style={{ left: animation.position.x, bottom: animation.position.y }}
      animate={controls}
    >
    </motion.div>
  </>
}

export default PoisonSprayAnimation