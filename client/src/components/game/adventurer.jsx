import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect } from "react";
import healAnim from "../../assets/animations/heal.json";
import bolt from "../../assets/images/bolt.png";
import monarch from "../../assets/images/monarch.png";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from '../../contexts/battleContext';
import { ADVENTURER_ID } from '../../helpers/constants';
import { CustomTooltip } from '../../helpers/styles';
import DamageAnimation from '../animations/damageAnimation';

export default function Adventurer(props) {
  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)
  const damage = animationHandler.damageAnimations.find(x => x.targetId === ADVENTURER_ID)

  const heal = useLottie({
    animationData: healAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '100px', left: '50px', top: '20px' },
    onComplete: () => heal.stop()
  });

  useEffect(() => {
    if (animationHandler.heroAnimations.length < 1) {
      return
    }
    const animation = animationHandler.heroAnimations[0]

    if (animation.type === 'heal') {
      heal.play()
      animationHandler.setHeroAnimations(prev => prev.filter(x => x.type !== 'heal'))
    }
  }, [animationHandler.heroAnimations])

  return <Box sx={styles.king}>
    {damage && <DamageAnimation id={damage.id} damage={damage.damage} mini={true} />}

    {heal.View}


    <img alt='' src={monarch} height={'70%'} />

    <Box sx={{ display: 'flex', gap: 1 }}>
      <CustomTooltip title={
        <Box mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img alt='' src={bolt} height={20} />
            <Typography color="primary" variant='h6'>Energy</Typography>
          </Box>
          <Typography mt={0.5}>Cards require energy to play.</Typography>
          <Typography>You get more energy each turn, up to 10.</Typography>
        </Box>
      }>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3">
            {battle.adventurer.energy}
          </Typography>

          <img alt='' src={bolt} height={25} />
        </Box>
      </CustomTooltip>

      <CustomTooltip title={
        <Box mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon htmlColor="red" fontSize='small' />
            <Typography color="primary" variant='h6'>Health</Typography>
          </Box>
          <Typography mt={0.5}>If your health reaches 0, you die.</Typography>
          <Typography>You cannot have more than 30 health.</Typography>
        </Box>
      }>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3">
            {battle.adventurer.health}
          </Typography>

          <FavoriteIcon htmlColor="red" />
        </Box>
      </CustomTooltip>
    </Box>

  </Box>
}

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '100%',
    height: '90%',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  myContainer: {
    width: '100%',
    height: '35%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  targetIcon: {
    width: '35px',
    height: '35px',
    position: 'absolute',
    top: '-25px',
    left: 'calc(50%-18px)',
  },
  king: {
    width: '200px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    pt: 2,
    gap: 1.5,
    position: 'relative'
  }
}