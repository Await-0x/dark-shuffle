import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLottie } from 'lottie-react';
import healAnim from "../../../assets/animations/heal.json";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { CustomTooltip } from '../../../helpers/styles';
import DamageAnimation from '../../animations/damageAnimation';

function Troll(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props
  const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

  const heal = useLottie({
    animationData: healAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', width: '200px', left: 0, top: 0 },
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

  return <CustomTooltip position={'right'} title={
    <Box mb={1}>
      <Typography color="primary" variant='h6'>Troll</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Rage</Typography>
      </Box>
      <Typography mt={0.5}>Gains +1 attack each round.</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Regeneration</Typography>
      </Box>
      <Typography mt={0.5}>Restores (4) health each turn.</Typography>
    </Box>

  }>
    <Box sx={styles.container}>
      {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

      {heal.View}

      <Box sx={styles.imageContainer}>
        {monster.image}
      </Box>

      <Box sx={styles.bottomContainer}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {monster.attack}
          </Typography>

          <img alt='' src={sword} height={24} width={24} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {monster.health}
          </Typography>

          <FavoriteIcon htmlColor="red" />
        </Box>
      </Box>

    </Box>
  </CustomTooltip>
}

export default Troll

const styles = {
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    width: '200px',
    height: '200px',
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
    height: '75%'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}