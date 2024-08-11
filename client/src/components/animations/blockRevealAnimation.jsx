import { Box, Typography } from "@mui/material"
import { isMobile } from 'react-device-detect';

function BlockRevealAnimation(props) {
  return <Box sx={styles.container}>
    {!props.hideText && <Typography variant={isMobile ? 'h5' : 'h2'} color='primary' sx={styles.text}>
      Waiting for block reveal
    </Typography>}

    {props.icon && <Box sx={styles.loader}>
      <Box sx={[styles.inner, styles.one]} />
      <Box sx={[styles.inner, styles.two]} />
      <Box sx={[styles.inner, styles.three]} />
    </Box>}
  </Box>
}

export default BlockRevealAnimation

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6
  },

  loader: {
    width: '82px',
    height: '82px',
    borderRadius: '50%',
    perspective: '800px',
  },

  inner: {
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    borderRadius: '50%'
  },

  one: {
    left: '0%',
    top: '0%',
    animation: 'rotate-one 1s linear infinite',
    borderBottom: '3px solid #FFE97F'
  },

  two: {
    right: '0%',
    top: '0%',
    animation: 'rotate-two 1s linear infinite',
    borderRight: '3px solid #FFE97F'
  },

  three: {
    right: '0%',
    bottom: '0%',
    animation: 'rotate-three 1s linear infinite',
    borderTop: '3px solid #FFE97F'
  },

  text: {
    height: '40px',
    animation: 'blink 2.5s ease-in-out infinite'
  }
}