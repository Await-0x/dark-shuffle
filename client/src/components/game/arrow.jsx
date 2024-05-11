import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";

function Arrow(props) {
  const { arrow, cancel } = props
  const ref = useRef()

  useEffect(() => {
    document.addEventListener('mousemove', _onMouseMove);
    document.addEventListener('mouseup', _onMouseUp);
  }, [])


  const _onMouseMove = (event) => {
    var x = arrow.clientX
    var y = arrow.clientY
    var radians = Math.atan2(event.pageX - x, event.pageY - y)
    var degree = (radians * (180 / Math.PI) * -1) + 90

    const distance = Math.floor(Math.sqrt(Math.pow(event.pageX - x, 2) + Math.pow(event.pageY - y, 2)))
    ref.current.style.transform = `rotate(${degree}deg)`
    ref.current.style.width = `${distance}px`
    ref.current.style.opacity = '0.9'
    event.preventDefault();
  };

  const _onMouseUp = (event) => {
    document.removeEventListener('mousemove', _onMouseMove);
    document.removeEventListener('mouseup', _onMouseUp);

    event.preventDefault();

    cancel()
  }

  return <Box sx={styles.arrow} ref={ref} style={{ top: arrow.clientY, left: arrow.clientX }}>
    <Box sx={styles.arrowHead} />
  </Box>
}

export default Arrow

const styles = {
  arrow: {
    background: '#FFE97F',
    height: '3px',
    width: '0px',
    position: 'fixed',
    transformOrigin: 'center left',
    opacity: '0',
    transform: 'rotate(270deg)',
    pointerEvents: 'none',
    zIndex: 99
  },
  arrowHead: {
    position: 'absolute',
    right: '-20px',
    top: '-9px',
    width: '0',
    height: '0',
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderLeft: '20px solid #FFE97F',
  },
};