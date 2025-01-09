import { Box, Button, Dialog, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { fadeVariant } from "../../helpers/variants";

function StartSeason(props) {
  const { open, close, start } = props

  const handleStart = () => {
    start()
    close(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => close(false)}
      maxWidth={'lg'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 1)', border: '2px solid #FFE97F' }
      }}
    >
      <Box sx={styles.dialogContainer}>
        <motion.div variants={fadeVariant} exit='exit' animate='enter'>
          <Box sx={styles.container}>

            <Typography variant='h4' color='primary' textAlign='center'>
              Season Entry Fee
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography color='white' sx={{ lineHeight: 1.5 }}>
                You are about to enter the season, 20 lords will be deducted from your account.
              </Typography>
              <Typography color='white' mt={1}>
                Please note:
              </Typography>
              <Typography color='white' mb={1}>
                - Bugs might occur.<br />
                - Funds may be lost due to unforeseen issues.<br />
              </Typography>

              <Button variant='outlined' onClick={handleStart} size='large'>
                <Typography color='primary'>
                  I understand
                </Typography>
              </Button>
            </Box>

          </Box>
        </motion.div>
      </Box>
    </Dialog>
  )
}

export default StartSeason

const styles = {
  dialogContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    py: 2.5,
    px: 3,
    width: '100%',
    maxWidth: '500px',
    overflow: 'hidden'
  },
  container: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5
  },
}