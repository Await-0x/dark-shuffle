import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import { isMobile } from 'react-device-detect';
import healAnim from "../../../assets/animations/heal.json";
import swirlAnim from "../../../assets/animations/swirl.json";
import { AnimationContext } from '../../../contexts/animationHandler';
import { BattleContext } from '../../../contexts/battleContext';
import MonsterMain from './main';
import { GameContext } from '../../../contexts/gameContext';

function Lich(props) {
  const game = useContext(GameContext)
  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)

  const { monster } = props

  const heal = useLottie({
    animationData: healAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: isMobile ? '120px' : '200px', left: 0, top: 0 },
    onComplete: () => endHeal()
  });

  const swirl = useLottie({
    animationData: swirlAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '300px', left: '-50px', top: '-45px' },
    onComplete: () => endLifeDrain()
  });

  const endLifeDrain = () => {
    swirl.stop()

    battle.utils.healMonster((battle.state.board.length + 1) * game.values.branch)
    battle.utils.damageBoard(game.values.branch);
    battle.utils.damageAdventurer(game.values.branch);

    heal.play()
  }

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
      swirl.play()
    }
  }, [animationHandler.monsterAnimations])

  return <>
    {swirl.View}
    {heal.View}

    <MonsterMain monster={monster} />
  </>
}

export default Lich