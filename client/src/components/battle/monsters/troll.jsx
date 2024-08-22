import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import { isMobile } from 'react-device-detect';
import healAnim from "../../../assets/animations/heal.json";
import { AnimationContext } from '../../../contexts/animationHandler';
import MonsterMain from './main';

function Troll(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props

  const heal = useLottie({
    animationData: healAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: isMobile ? '120px' : '200px', left: 0, top: 0 },
    onComplete: () => endHeal()
  });

  const endHeal = () => {
    heal.stop()
    animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))
    animationHandler.animationCompleted({ type: 'monsterAbility' })
  }

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      heal.play()
    }
  }, [animationHandler.monsterAnimations])

  return <>
    {heal.View}
    <MonsterMain monster={monster} />
  </>
}

export default Troll