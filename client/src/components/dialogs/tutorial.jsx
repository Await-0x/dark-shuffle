import { Box, Button, Dialog, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { MONSTER_LIST } from '../../battle/monsterUtils';
import { fetch_image } from '../../helpers/cards';
import vortex from "../../assets/images/vortex.png"

function TutorialDialog(props) {
  const { open, close } = props

  return (
    <Dialog
      open={open}
      onClose={() => close(false)}
      maxWidth={'md'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 0.98)', border: '1px solid rgba(255, 255, 255, 0.5)' }
      }}
    >

      <Box sx={styles.container}>

        <Typography color='primary' variant='h2'>
          Quick guide
        </Typography>

        <Box sx={styles.guideRow}>

          <Box width='40%'>
            <Typography variant='h5' color='primary'>
              Play cards for energy
            </Typography>
            <Typography mt={1}>
              Cards cost energy to play.
            </Typography>
            <Typography>
              Your energy increases each round.
            </Typography>
          </Box>

          <Box width='40%' display={'flex'} gap={1} height={'30px'} alignItems={'center'} justifyContent={'flex-end'}>
            <ArrowForwardIcon fontSize='large' color='primary' />

            <Box sx={styles.card}>
              <Box sx={styles.circle} border={'1px solid #FFE97F'}>
                <Typography>
                  4
                </Typography>
              </Box>

              <Typography>
                Wild Dog
              </Typography>
            </Box>
          </Box>

        </Box>

        <Box sx={styles.guideRow}>
          <Box width='40%'>
            <Typography variant='h5' color='primary'>
              Discard cards for (1) energy
            </Typography>
            <Typography mt={1}>
              Drag cards to the vortex to discard them. At the beginning of each round, you draw cards until you have 5 in your hand.
            </Typography>
          </Box>

          <Box width='40%' display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            <Box width='140px' zIndex={999} mr={5}>
              <img src={vortex} alt='' />
            </Box>
          </Box>
        </Box>

        <Box sx={styles.guideRow}>
          <Box width='40%'>
            <Typography variant='h5' color='primary'>
              Attack Monster
            </Typography>
            <Typography mt={1}>
              Use your creatures to attack the monster. Dead creatures goes to the bottom of your deck.
            </Typography>
          </Box>

          <Box width='40%' display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1}>
            <Box sx={{ ...styles.card, height: '75px', width: '75px', justifyContent: 'center' }}>
              <img alt='' src={fetch_image('Wild Dog')} height={'100%'} />
            </Box>

            <ArrowForwardIcon color='primary' fontSize='large' />

            <Box height={'100px'}>
              {MONSTER_LIST[0].image}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant='outlined' size='large' sx={{ fontSize: '16px', letterSpacing: '2px' }} onClick={() => close(false)}>
            START GAME
          </Button>
        </Box>

      </Box>

    </Dialog>
  )
}

export default TutorialDialog

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '800px',
    height: '660px',
    p: 3,
    gap: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  guideRow: {
    width: '100%',
    height: '200px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  card: {
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    width: '200px',
    display: 'flex',
    alignItems: 'center',
    p: 1,
    gap: 2
  },
  circle: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px'
  }
}