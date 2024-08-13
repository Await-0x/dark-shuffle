import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import intimidateAnim from "../../../assets/animations/intimidate.json";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import DamageAnimation from '../../animations/damageAnimation';
import { isMobile } from 'react-device-detect';
import { EnemyHealthBar } from '../../../helpers/styles';
import { normalise } from '../../../helpers/utilities';

function Chimera(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props
  const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

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

  return <Box sx={styles.container}>
    <EnemyHealthBar variant="determinate" value={normalise(monster.health, monster.startHealth)} />

    {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

    {intimidate.View}

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

export default Chimera

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