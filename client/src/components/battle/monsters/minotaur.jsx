import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import { isMobile } from 'react-device-detect';
import rageAnim from "../../../assets/animations/rage.json";
import { AnimationContext } from '../../../contexts/animationHandler';
import MonsterMain from './main';

function Minotaur(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props

  const rage = useLottie({
    animationData: rageAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: isMobile ? '120px' : '200px', left: '0px', top: '0px' },
    onComplete: () => endRage()
  });

  const endRage = () => {
    rage.stop()
    animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))
    animationHandler.animationCompleted({ type: 'monsterAbility' })
  }

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      rage.setSpeed(0.5)
      rage.play()
    }
  }, [animationHandler.monsterAnimations])

  return <>
    {rage.View}

    <MonsterMain monster={monster} />
  </>
}

export default Minotaur