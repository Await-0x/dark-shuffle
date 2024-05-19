import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import sword from "../../../assets/images/sword.png";
import { AnimationContext } from '../../../contexts/animationHandler';
import { CustomTooltip } from '../../../helpers/styles';
import DamageAnimation from '../../animations/damageAnimation';
import { BattleContext } from '../../../contexts/battleContext';

function Spider(props) {
  const animationHandler = useContext(AnimationContext)
  const battle = useContext(BattleContext)

  const { monster } = props
  const damage = animationHandler.damageAnimations.find(x => x.targetId === monster.id)

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'ability') {
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'ability'))

      if (battle.state.board.length > 0) {
        animationHandler.addAnimation('board', null, battle.state.board.map(creature => ({
          targetPosition: battle.utils.getCreaturePosition(creature.id), position: battle.utils.getMonsterPosition()
        })))
      } else {
        animationHandler.animationCompleted({ type: 'monsterAbility' })
      }
    }
  }, [animationHandler.monsterAnimations])

  return <CustomTooltip position={'right'} title={
    <Box mb={1}>
      <Typography color="primary" variant='h6'>Spider</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Typography color="primary">★ Poison Spray</Typography>
      </Box>
      <Typography mt={0.5}>Deals (2) damage to each creature.</Typography>
    </Box>

  }>
    <Box sx={styles.container}>
      {damage && <DamageAnimation id={damage.id} damage={damage.damage} />}

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

export default Spider

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