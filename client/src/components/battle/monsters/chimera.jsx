import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import { isMobile } from 'react-device-detect';
import intimidateAnim from "../../../assets/animations/intimidate.json";
import { AnimationContext } from '../../../contexts/animationHandler';
import MonsterMain from './main';

function Chimera(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props

  const intimidate = useLottie({
    animationData: intimidateAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: isMobile ? '120px' : '200px', left: '0px', top: '0px' },
    onComplete: () => endIntimidate()
  });

  const endIntimidate = () => {
    intimidate.stop()
    animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'intimidate'))
  }

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))
      animationHandler.animationCompleted({ type: 'monsterAbility' })
    }

    if (animation.type === 'intimidate') {
      intimidate.play()
    }
  }, [animationHandler.monsterAnimations])

  return <>
    {intimidate.View}

    <MonsterMain monster={monster} />
  </>
}

export default Chimera