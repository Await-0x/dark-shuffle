import { motion } from "framer-motion"
import { fadeVariant } from "../../helpers/variants"
import { Box, Button, ButtonGroup, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import background from "../../assets/images/cards/impling.png";
import { GAME_COST, GAME_FEE } from '../../helpers/constants';

function AddFunds(props) {
  const { fade } = props
  const [amount, setAmount] = useState(GAME_COST + GAME_FEE);

  const buttons = [
    <Button key="one" color='warning' onClick={() => setAmount(GAME_COST + GAME_FEE)}>1 Game</Button>,
    <Button key="two" color='warning' onClick={() => setAmount((GAME_COST + GAME_FEE) * 3)}>3 Games</Button>,
    <Button key="three" color='warning' onClick={() => setAmount((GAME_COST + GAME_FEE) * 5)}>5 Games</Button>,
  ];

  return (
    <motion.div variants={fadeVariant} initial={fade == 2 ? false : 'initial'} exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.providerContainer}>
          <Typography color='white' variant='h5'>
            Fund Your Game Account
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <ButtonGroup size="small" aria-label="Small button group">
              {buttons}
            </ButtonGroup>

            <TextField
              size="medium"
              type='text'
              InputProps={{
                endAdornment: <InputAdornment position="start">$LORDS</InputAdornment>,
              }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Button variant='contained' size='large'>
              <Typography color='black'>
                Add Funds
              </Typography>
            </Button>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={2} mt={2}>
            <Typography variant='subtitle2' sx={{ fontSize: '13px' }}>
              $LORDS are used for entry fees and tx fees.
            </Typography>
          </Box>
        </Box>

        <Box display='flex' mr={5}>
          <img alt='' src={background} width={200} />
        </Box>

      </Box>
    </motion.div>
  )
}

export default AddFunds

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