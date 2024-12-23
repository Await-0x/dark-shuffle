import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, Typography } from '@mui/material';

function StartGameDialog(props) {

  return (
    <Dialog
      open={true}
      maxWidth={'md'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 0.98)', border: '2px solid #FFE97F' }
      }}
    >

      <Box sx={styles.container}>
        <Typography variant='h3' color={'primary'}>Entering Season</Typography>

        <Box display={'flex'} alignItems={'baseline'}>
          <Typography variant='h6' color={'primary'}>{props.status}</Typography>
          <div className='dotLoader' />
        </Box>

      </Box>

    </Dialog>
  )
}

export default StartGameDialog

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '400px',
    p: 4,
    gap: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative'
  },
}