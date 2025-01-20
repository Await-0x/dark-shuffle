import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { GameContext } from '../contexts/gameContext';
import { useReplay } from '../contexts/replayContext';

function ReplayOverlay(props) {
  const replay = useReplay();
  const game = useContext(GameContext);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        replay.nextStep();
      } else if (event.key === 'ArrowLeft') {
        replay.previousStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [replay]);

  if (!game.values.replay) {
    return null;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '2px' }} onClick={() => replay.previousStep()}>
        <IconButton onClick={() => replay.previousStep()}>
          <ArrowBackIosIcon color='primary' sx={{ fontSize: '20px' }} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Typography variant='body1' color={'primary'}>Prev Step</Typography>
          </Box>

          <Typography color={'#FFF'} sx={{ fontSize: '10px', mt: '-2px' }}>(Left Arrow)</Typography>
        </Box>
      </Box>


      <Button variant='outlined' color='primary' onClick={() => replay.endReplay()}>
        End Replay
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '2px' }} onClick={() => replay.previousStep()}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Typography variant='body1' color={'primary'}>Next Step</Typography>
          </Box>

          <Typography color={'#FFF'} sx={{ fontSize: '10px', mt: '-2px' }}>(Right Arrow)</Typography>
        </Box>

        <IconButton onClick={() => replay.nextStep()}>
          <ArrowForwardIosIcon color='primary' sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>
    </Box>

  )
}

export default ReplayOverlay

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '500px',
    maxWidth: '100%',
    height: '56px',
    zIndex: 9999,
    boxSizing: 'border-box',
    border: '1px solid #f59100',
    borderBottom: '1px solid #141920',
    borderRadius: '4px 4px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141920',
    px: '4px'
  },
}