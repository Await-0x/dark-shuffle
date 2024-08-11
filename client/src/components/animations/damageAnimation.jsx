import { motion, useAnimationControls } from "framer-motion";
import { Box, Typography } from "@mui/material"
import { AnimationContext } from "../../contexts/animationHandler"
import { useContext, useEffect } from "react"
import splatter from "../../assets/images/splatter.png"
import { isMobile } from "react-device-detect"

function DamageAnimation(props) {
  const { id, damage, small, mini } = props

  const animationHandler = useContext(AnimationContext)

  const controls = useAnimationControls()

  useEffect(() => {
    startAnimation()
  }, [damage])

  async function startAnimation() {
    try {
      await controls.set({ opacity: 1 })

      await controls.start({
        opacity: 0,
        transition: { duration: 1, delay: 2 }
      })

      animationHandler.actions.setAnimations(prev => ({ ...prev, [id]: null }));
    } catch (ex) { }
  }

  let position = mini ? { zIndex: 99, position: 'absolute', left: '70px', top: '35px' }
    : small ? { zIndex: 99, position: 'absolute', left: isMobile ? '12px' : '15px', top: isMobile ? '12px' : '15px' }
      : { zIndex: 99, position: 'absolute', left: isMobile ? '15px' : '25px', top: isMobile ? '15px' : '25px' }

  let size = mini ? { width: '60px', height: '60px' } : small ? { width: isMobile ? '75px' : '90px', height: isMobile ? '75px' : '90px' }
    : { width: isMobile ? '90px' : '150px', height: isMobile ? '90px' : '150px' }

  return <motion.div
    style={position}
    animate={controls}
  >

    <Box sx={size} display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <img alt='' src={splatter} height={'100%'} width={'100%'} style={{ position: 'absolute' }} />
      {small
        ? <Typography variant='h6' sx={styles.smallDamageText}>
          -{damage}
        </Typography>
        : <Typography variant='h4' sx={styles.damageText}>
          -{damage}
        </Typography>
      }
    </Box>

  </motion.div>
}

export default DamageAnimation

const styles = {
  damageText: {
    textShadow: '1px 1px 2px black',
    zIndex: 2
  },
  smallDamageText: {
    textShadow: '1px 1px 2px black',
    zIndex: 2
  }
}