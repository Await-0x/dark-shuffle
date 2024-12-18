import { Box, Typography } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import splatter from "../../assets/images/splatter.png";

function DamageAnimation(props) {
  const { damage, small, mini } = props

  const controls = useAnimationControls()

  useEffect(() => {
    if (damage > 0) {
      startAnimation()
    }
  }, [damage])

  async function startAnimation() {
    try {
      await controls.set({ opacity: 1, display: 'inherit' })

      await controls.start({
        opacity: 0,
        transition: { duration: 1, delay: 2 }
      })

      await controls.set({ display: 'none' })
    } catch (ex) { }
  }

  let position = mini ? { zIndex: 99, position: 'absolute', left: '70px', top: '35px' }
    : small ? { zIndex: 99, position: 'absolute', left: isMobile ? '12px' : '15px', top: isMobile ? '12px' : '15px' }
      : { zIndex: 99, position: 'absolute', left: isMobile ? '15px' : '25px', top: isMobile ? '15px' : '25px' }

  let size = mini ? { width: '60px', height: '60px' } : small ? { width: isMobile ? '75px' : '90px', height: isMobile ? '75px' : '90px' }
    : { width: isMobile ? '120px' : '150px', height: isMobile ? '120px' : '150px' }

  return <motion.div
    style={{ ...position, display: 'none' }}
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