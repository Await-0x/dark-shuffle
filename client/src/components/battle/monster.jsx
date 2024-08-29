import { Box } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useLottie } from 'lottie-react';
import React, { useContext, useEffect, useRef } from "react";
import { isMobile } from 'react-device-detect';
import skullAnim from "../../assets/animations/skull.json";
import { AnimationContext } from '../../contexts/animationHandler';
import { CustomTooltip } from "../../helpers/styles";
import DamageAnimation from '../animations/damageAnimation';
import Bigfoot from './monsters/Bigfoot';
import Chimera from './monsters/Chimera';
import Kappa from './monsters/Kappa';
import Lich from './monsters/Lich';
import Minotaur from './monsters/Minotaur';
import Spider from './monsters/Spider';
import Troll from './monsters/Troll';
import Bear from "./monsters/Bear";
import Cyclops from "./monsters/Cyclops";
import Golem from "./monsters/Golem";
import Orc from "./monsters/Orc";
import Phoenix from "./monsters/Phoenix";
import Pixie from "./monsters/Pixie";
import Rat from "./monsters/Rat";
import Satori from "./monsters/Satori";
import Snake from "./monsters/Snake";
import Titan from "./monsters/Titan";
import Warlock from "./monsters/Warlock";
import Weretiger from "./monsters/Weretiger";
import Wraith from "./monsters/Wraith";
import Yeti from "./monsters/Yeti";
import { delay } from "../../helpers/utilities";

function Monster(props) {
  const animationHandler = useContext(AnimationContext)

  const { monster } = props
  const controls = useAnimationControls()
  const skullControls = useAnimationControls()
  const ref = useRef()

  const skull = useLottie({
    animationData: skullAnim,
    loop: false,
    autoplay: false,
    style: isMobile ? { height: '120px', width: '120px' } : { height: '200px', width: '200px' },
    onComplete: () => skull.stop()
  });

  useEffect(() => {
    if (monster.health <= 0) {
      fadeSkull()
      skull.play()
    }
  }, [monster.health])

  useEffect(() => {
    if (animationHandler.monsterAnimations.length < 1) {
      return
    }

    const animation = animationHandler.monsterAnimations[0]

    if (animation.type === 'attack') {
      attackAnimation(animation)
      animationHandler.setMonsterAnimations(prev => prev.filter(x => x.type !== 'attack'))
    }
  }, [animationHandler.monsterAnimations])

  const fadeSkull = async () => {
    await skullControls.start({
      opacity: 0,
      transition: { duration: 2, delay: 1 }
    })
  }

  const attackAnimation = async (animation) => {
    const { position, targetPosition } = animation
    await delay(500)

    ref.current.style.background = 'black'

    await controls.start({
      x: targetPosition.x - position.x,
      y: position.y - targetPosition.y,
      zIndex: 100,
    })

    controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      zIndex: 0
    })


    ref.current.style.background = 'none'
    animationHandler.animationCompleted({ type: 'monsterAttack' })
  }

  let damage = animationHandler.state.animations.monsterDamaged

  return <>
    <motion.div
      layout
      onMouseUp={(event) => mouseUpHandler(event)}
      animate={controls}
      ref={ref}
      style={isMobile ? { position: 'relative', width: '120px', height: '120px' } : { position: 'relative', width: '200px', height: '200px' }}
    >

      {(damage && monster.health > 0) && <DamageAnimation id={'monsterDamaged'} damage={damage} />}

      <motion.div animate={skullControls} style={{ left: isMobile ? 'calc(50% - 60px)' : 'calc(50% - 100px)', top: 0, position: 'absolute', opacity: monster.health > 0 ? 0 : 1 }}>
        {skull.View}
      </motion.div>

      {monster.health > 0 && <CustomTooltip position={'right'} title={<Box mb={1}>
        {monster.abilities}
      </Box>}>
        <Box sx={styles.container}>
          {monster.name === 'Minotaur' && <Minotaur monster={monster} />}
          {monster.name === 'Troll' && <Troll monster={monster} />}
          {monster.name === 'Bigfoot' && <Bigfoot monster={monster} />}
          {monster.name === 'Chimera' && <Chimera monster={monster} />}
          {monster.name === 'Kappa' && <Kappa monster={monster} />}
          {monster.name === 'Spider' && <Spider monster={monster} />}
          {monster.name === 'Lich' && <Lich monster={monster} />}
          {monster.name === 'Bear' && <Bear monster={monster} />}
          {monster.name === 'Cyclops' && <Cyclops monster={monster} />}
          {monster.name === 'Golem' && <Golem monster={monster} />}
          {monster.name === 'Orc' && <Orc monster={monster} />}
          {monster.name === 'Phoenix' && <Phoenix monster={monster} />}
          {monster.name === 'Pixie' && <Pixie monster={monster} />}
          {monster.name === 'Rat' && <Rat monster={monster} />}
          {monster.name === 'Satori' && <Satori monster={monster} />}
          {monster.name === 'Snake' && <Snake monster={monster} />}
          {monster.name === 'Titan' && <Titan monster={monster} />}
          {monster.name === 'Warlock' && <Warlock monster={monster} />}
          {monster.name === 'Weretiger' && <Weretiger monster={monster} />}
          {monster.name === 'Wraith' && <Wraith monster={monster} />}
          {monster.name === 'Yeti' && <Yeti monster={monster} />}
        </Box>
      </CustomTooltip>}

    </motion.div>
  </>
}

export default Monster

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
  }
}