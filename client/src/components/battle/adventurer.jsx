import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useState } from "react";
import shieldAnim from "../../assets/animations/shield.json";
import bolt from "../../assets/images/bolt.png";
import monarch from "../../assets/images/monarch.png";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from '../../contexts/battleContext';
import { GameContext } from '../../contexts/gameContext';
import { ADVENTURER_ID, START_HEALTH } from '../../helpers/constants';
import { CustomTooltip, EnergyBar, HealthBar, ShieldBar } from '../../helpers/styles';
import { normalise } from '../../helpers/utilities';
import DamageAnimation from '../animations/damageAnimation';

export default function Adventurer(props) {
  const game = useContext(GameContext)
  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)
  const damage = animationHandler.damageAnimations.find(x => x.targetId === ADVENTURER_ID)

  const _shield = useLottie({
    animationData: shieldAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '65px', height: '65px', top: '30px', left: '67px' },
    onComplete: () => _shield.stop()
  });

  useEffect(() => {
    if (animationHandler.heroAnimations.length < 1) {
      return
    }
    const animation = animationHandler.heroAnimations[0]

    if (animation.type === 'shield') {
      _shield.play()
      animationHandler.setHeroAnimations(prev => prev.filter(x => x.type !== 'shield'))
    }
  }, [animationHandler.heroAnimations])

  return <Box sx={styles.king}>
    {damage && <DamageAnimation id={damage.id} damage={damage.damage} mini={true} />}

    {_shield.View}

    <img alt='' src={monarch} height={'70%'} />

    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomTooltip title={
          <Box mb={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img alt='' src={bolt} height={20} />
              <Typography color="primary" variant='h6'>Energy</Typography>
            </Box>
            <Typography mt={0.5}>Cards require energy to play.</Typography>
          </Box>
        }>
          <Box width={'80px'} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            <Typography>
              {battle.state.values.heroEnergy}
            </Typography>

            <img alt='' src={bolt} height={18} />
          </Box>
        </CustomTooltip>

        <Box width={'160px'} ml={0.5} mr={'60px'} position={'relative'}>
          <EnergyBar variant="determinate" value={normalise(battle.state.values.heroEnergy, battle.state.values.round)} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <CustomTooltip title={
          <Box mb={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteIcon htmlColor="red" fontSize='small' />

              <Typography color="primary" variant='h6'>Health</Typography>
            </Box>
            <Typography mt={0.5}>If your health reaches 0, the game ends.</Typography>
          </Box>
        }>
          <Box width={'80px'} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            <Typography>
              {battle.state.values.heroHealth}
            </Typography>

            <FavoriteIcon htmlColor="red" sx={{ fontSize: '18px' }} />
          </Box>
        </CustomTooltip>

        <Box width={'160px'} ml={0.5} mr={'60px'}>
          <HealthBar variant="determinate" value={normalise(battle.state.values.heroHealth, Math.max(START_HEALTH, game.values.heroHealth))} />
        </Box>
      </Box>
    </Box>

  </Box >
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