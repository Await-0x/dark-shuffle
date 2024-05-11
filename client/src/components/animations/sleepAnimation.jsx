import { Box } from "@mui/material"

function SleepAnimation() {
  return <Box>
    <Box sx={[styles.zzz, styles.second]}>Z</Box>
    <Box sx={[styles.zzz, styles.first]} >Z</Box>
  </Box>
}

export default SleepAnimation

const styles = {
  zzz: {
    animationName: 'zzz',
    animationDuration: '1.5s',
    animationTimingFunction: 'ease-out',
    animationIterationCount: 'infinite',
    animationDirection: 'forwards',
    fontWeight: 'bold',
    position: 'absolute',
    fontSize: '0px',
    zIndex: '100',
    transform: 'translateY(100%)',
    fontFamily: 'Concert One, cursive'
  },

  first: {
    animationDelay: '0s',
    right: '60px'
  },

  second: {
    animationDelay: '1s',
    right: '55px',
  },
}