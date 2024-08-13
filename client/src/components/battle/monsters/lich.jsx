import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import healAnim from "../../../assets/animations/heal.json";
import swirlAnim from "../../../assets/animations/swirl.json";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { BattleContext } from '../../../contexts/battleContext';
import DamageAnimation from '../../animations/damageAnimation';
import { isMobile } from 'react-device-detect';
import { normalise } from '../../../helpers/utilities';
import { EnemyHealthBar } from '../../../helpers/styles';

function Lich(props) {
  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)

  const { monster } = props
  const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

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

    battle.utils.healMonster(battle.state.board.length + 1)
    battle.utils.damageBoard(1);
    battle.utils.damageAdventurer(1);

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

  return <Box sx={styles.container}>
    <EnemyHealthBar variant="determinate" value={normalise(monster.health, monster.startHealth)} />

    {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

    {swirl.View}
    {heal.View}

    <Box sx={styles.imageContainer}>
      {monster.image}
    </Box>

    <Box sx={styles.bottomContainer}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" fontSize={isMobile && '14px'}>
          {monster.attack}
        </Typography>

        <img alt='' src={sword} height={isMobile ? 20 : 24} width={isMobile ? 20 : 24} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" fontSize={isMobile && '14px'}>
          {monster.health}
        </Typography>

        <FavoriteIcon htmlColor="red" fontSize={isMobile ? 'small' : 'inherit'} />
      </Box>
    </Box>

  </Box>
}

export default Lich

const styles = {
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '70%'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}