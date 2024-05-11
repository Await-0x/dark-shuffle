import { motion, useAnimationControls } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { calculateDistance } from "../../helpers/utilities";
import { AnimationContext } from "../../contexts/animationHandler";

function StarAnimation(props) {
  const { id, left, bottom } = props

  const animationHandler = useContext(AnimationContext)

  const controls = useAnimationControls()

  const x2 = window.innerWidth - 215;
  const y2 = 75;

  let angleDegrees = Math.atan2(y2 - bottom, x2 - left) * (180 / Math.PI);
  angleDegrees = (angleDegrees + 360) % 360;
  const cssAngle = (450 - angleDegrees) % 360 - 90;

  useEffect(() => {
    startAnimation()

    return () => {
      animationHandler.setCreatureAnimations(prev => prev.filter(x => x.id !== id))
    }
  }, [])

  async function startAnimation() {
    await controls.start({
      width: `${calculateDistance(left, bottom, x2, y2)}px`,
      transition: { duration: 1 }
    })

    animationHandler.setCreatureAnimations(prev => prev.filter(x => x.id !== id))
  }

  return <>
    <motion.div
      key={id}
      className='shooting_star'
      style={{ left, bottom, rotate: cssAngle }}
      animate={controls}
    >
    </motion.div>
  </>
}

export default StarAnimation