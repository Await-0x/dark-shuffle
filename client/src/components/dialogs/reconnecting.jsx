import { Box, Dialog, Typography } from '@mui/material';

function ReconnectDialog(props) {
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

        <Typography>Reconnecting...</Typography>

      </Box>

    </Dialog>
  )
}

export default ReconnectDialog

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '400px',
    height: '300px',
    p: 3,
    gap: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden'
  },
}