import { motion } from "framer-motion"
import { fadeVariant } from "../../helpers/variants"
import { Box, Button, Divider, Stack, Typography, Link } from '@mui/material';
import background from "../../assets/images/cards/gospel_scribe.png";

function CreateBurner(props) {
  const { fade, setActiveStep } = props

  return (
    <motion.div variants={fadeVariant} initial={fade ? false : 'initial'} exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.providerContainer}>
          <Typography color='white' variant='h4'>
            Game Account
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant='outlined' size='large' onClick={() => create()}>
              <Typography color='primary'>
                Create Account
              </Typography>
            </Button>

            <Stack direction='row' width='100%' alignItems={'center'} justifyContent={'space-between'} my={1}>
              <Divider sx={{ width: '40%' }} />
              <Typography variant='h6'>
                or
              </Typography>
              <Divider sx={{ width: '40%' }} />
            </Stack>

            <Button color='warning' variant='outlined' size='large'>
              <Typography color='#f59100'>
                Recover Account
              </Typography>
            </Button>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={2} mt={2}>
            <Typography variant='subtitle2' sx={{ fontSize: '13px' }}>
              A game account allows signature free gameplay and improves the security of your funds.
            </Typography>
            <Link>
              <Typography color='secondary' sx={{ fontSize: '10px' }}>
                NO THANKS, I WANT TO SIGN EVERY TX
              </Typography>
            </Link>
          </Box>
        </Box>

        <Box display='flex' mr={5}>
          <img alt='' src={background} width={220} />
        </Box>

      </Box>
    </motion.div>
  )
}

export default CreateBurner

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '100%',
    gap: 10,
    p: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    mt: 4
  },
  providerContainer: {
    height: '100%',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }
}