import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion, useAnimationControls } from "framer-motion";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { CustomTooltip } from '../../../helpers/styles';
import DamageAnimation from '../../animations/damageAnimation';

function Bigfoot(props) {
  const animationHandler = useContext(AnimationContext)
  const controls = useAnimationControls()

  const { monster } = props
  const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))
      animationHandler.animationCompleted({ type: 'monsterAbility' })
    }

    if (animation.type === 'defend') {
      showShield()
    }
  }, [animationHandler.monsterAnimations])

  async function showShield() {
    await controls.start({
      opacity: [0, 1, 1, 1, 0],
    })

    animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'defend'))
  }

  return <CustomTooltip position={'right'} title={
    <Box mb={1}>
      <Typography color="primary" variant='h6'>Bigfoot</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Thick Skin</Typography>
      </Box>
      <Typography mt={0.5}>Takes (1) less damage from all sources.</Typography>
    </Box>

  }>
    <Box sx={styles.container}>
      {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

      <motion.div animate={controls} style={styles.armor} />

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

export default Bigfoot

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
  armor: {
    bottom: '50px',
    left: '35px',
    position: 'absolute',
    width: '130px',
    height: '80px',
    borderRadius: '50%',
    boxShadow: '1px 10px 5px -3px #b2b3b7',
    opacity: 0
  }
}