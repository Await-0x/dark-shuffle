import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';
import healAnim from "../../assets/animations/heal.json";
import shieldAnim from "../../assets/animations/shield.json";
import swirlAnim from "../../assets/animations/swirl.json";
import triangleAnim from "../../assets/animations/triangle.json";
import shield from "../../assets/images/shield.png";
import sword from "../../assets/images/sword.png";
import { AnimationContext } from '../../contexts/animationHandler';
import { BattleContext } from '../../contexts/battleContext';
import { CardSize, fetch_image, types } from '../../helpers/cards';
import DamageAnimation from '../animations/damageAnimation';
import SleepAnimation from '../animations/sleepAnimation';
import Card from '../card';

let mobileSize = { width: '100px', height: '100px' }
let browserSize = { width: '120px', height: '120px' }

function Creature(props) {
  const { creature, startAttack, attacking } = props

  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)

  const [displayCard, setDisplayCard] = useState(null)

  const swirl = useLottie({
    animationData: swirlAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', top: '0', left: '0', ...(isMobile ? mobileSize : browserSize) },
    onComplete: () => swirl.stop()
  });

  const heal = useLottie({
    animationData: healAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', top: '0', left: '0', ...(isMobile ? mobileSize : browserSize) },
    onComplete: () => heal.stop()
  });

  const _shield = useLottie({
    animationData: shieldAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', top: '0', left: '0', ...(isMobile ? mobileSize : browserSize) },
    onComplete: () => _shield.stop()
  });

  const tauntAnim = useLottie({
    animationData: triangleAnim,
    loop: false,
    autoplay: false,
    style: { position: 'absolute', top: '0', left: '0', ...(isMobile ? mobileSize : browserSize) },
    onComplete: () => tauntAnim.stop()
  });

  const controls = useAnimationControls()

  const damage = animationHandler.damageAnimations.find(x => x.targetId === creature.id)

  useEffect(() => {
    const creatureAnimation = animationHandler.creatureAnimations.find(anim => anim.creatureId === creature.id)

    if (creatureAnimation) {

      if (creatureAnimation.type === 'attack') {
        attackAnimation(creatureAnimation)
        animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'attack' && x.creatureId !== creature.id))
      }

      if (creatureAnimation.type === 'swirl') {
        swirl.play()
        animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'swirl' && x.creatureId !== creature.id))
      }

      if (creatureAnimation.type === 'heal') {
        heal.play()
        animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'heal' && x.creatureId !== creature.id))
      }

      if (creatureAnimation.type === 'shield') {
        _shield.play()
        animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'shield' && x.creatureId !== creature.id))
      }

      if (creatureAnimation.type === 'taunt') {
        tauntAnim.play()
        animationHandler.setCreatureAnimations(prev => prev.filter(x => x.type === 'taunt' && x.creatureId !== creature.id))
      }

    }
  }, [animationHandler.creatureAnimations])

  const attackAnimation = async (creatureAnimation) => {
    const { creature, position, targetPosition } = creatureAnimation

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y
    })

    animationHandler.animationCompleted({ type: 'creatureAttack', creatureId: creature.id })

    await controls.start({
      x: 0,
      y: 0,
      rotate: 0
    })

    animationHandler.animationCompleted({ type: 'creatureAttackFinished', creatureId: creature.id })
  }

  const mouseUpHandler = (event) => {
    const card = battle.state.targetFriendlyCreature

    if (!card) {
      return
    }


    if (card.type === types.CREATURE) {
      battle.actions.summonCreature(card, creature)
    }

    if (card.type === types.SPELL) {
      battle.actions.castSpell(card, creature)
    }
  }

  return <Box sx={{ position: 'relative' }}>
    <motion.div
      style={isMobile ? { ...styles.mobileSize } : { ...styles.browserSize }}
      layout
      onPanStart={event => startAttack(creature, event)}
      onClick={event => startAttack(creature, event)}
      animate={controls}
      onHoverStart={() => setDisplayCard(creature)}
      onHoverEnd={() => setDisplayCard(null)}
      onMouseUp={(event) => mouseUpHandler(event)}
    >

      <Box sx={[isMobile ? styles.mobileSize : styles.browserSize, styles.container, attacking?.id === creature.id && styles.highlight, creature.resting && styles.faded, battle.state.targetFriendlyCreature && styles.targetable]}>

        {creature.resting && <SleepAnimation />}

        {damage && <DamageAnimation id={damage.id} damage={damage.damage} small={true} />}

        {heal.View}
        {_shield.View}
        {tauntAnim.View}

        <Box sx={styles.imageContainer}>
          <img alt='' src={fetch_image(creature.name)} height={'100%'} />
        </Box>

        <Box sx={styles.bottomContainer}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontSize={isMobile && '12px'}>
              {creature.attack}
            </Typography>

            <img alt='' src={sword} height={isMobile ? 20 : 24} width={isMobile ? 20 : 24} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontSize={isMobile && '12px'}>
              {creature.health}
            </Typography>

            {creature.shield
              ? <img alt='' src={shield} height={isMobile ? 20 : 24} width={isMobile ? 20 : 24} />
              : <FavoriteIcon htmlColor="red" fontSize={isMobile ? 'small' : 'inherit'} />
            }
          </Box>
        </Box>

      </Box>

    </motion.div>

    {displayCard && !attacking && <Box sx={styles.displayCard}>
      <Card card={displayCard} cost={battle.utils.getCardCost(displayCard)} />
    </Box>}
  </Box>
}

export default Creature

const styles = {
  browserSize,
  mobileSize,
  container: {
    boxSizing: 'border-box',
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '4px',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '65%'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faded: {
    opacity: 0.9,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },
  displayCard: {
    height: CardSize.big.height,
    width: CardSize.big.width,
    position: 'absolute',
    left: '136px',
    top: 0
  },
  targetIcon: {
    width: '35px',
    height: '35px',
    position: 'absolute',
    top: '-40px',
    left: '42px',
  },
  targetable: {
    boxShadow: '0px 1px 19px -2px #FFE97F, 0px 2px 3px 0px #FFE97F, 0px 1px 8px 0px #FFE97F'
  },
  highlight: {
    border: '1px solid #FFE97F !important',
  }
}