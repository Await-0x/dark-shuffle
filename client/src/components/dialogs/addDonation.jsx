import { getContractByName } from '@dojoengine/core';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import { useContext, useState } from "react";
import { dojoConfig } from '../../../dojo.config';
import { DojoContext } from '../../contexts/dojoContext';
import { fadeVariant } from "../../helpers/variants";

function AddDonation(props) {
  const { open, close, refresh } = props
  const { enqueueSnackbar } = useSnackbar()

  const dojo = useContext(DojoContext)

  const [amount, setAmount] = useState('')
  const [name, setName] = useState('Anonymous')
  const [social, setSocial] = useState('')

  const donate = async () => {
    if (name && (name.length < 2 || name.length > 31)) {
      return enqueueSnackbar('Name must be between 2 and 31 characters', { variant: 'warning' })
    }

    if (social && (social.length < 2 || social.length > 31)) {
      return enqueueSnackbar('Social must be between 2 and 31 characters', { variant: 'warning' })
    }

    if (amount < 10) {
      return enqueueSnackbar('Minimum donation is 10 LORDS', { variant: 'warning' })
    }

    const formattedName = '0x' + (name || 'Anonymous').split('').map(char => char.charCodeAt(0).toString(16)).join('')
    const formattedSocial = '0x' + (social || '0').split('').map(char => char.charCodeAt(0).toString(16)).join('')

    const txs = [
      {
        contractAddress: dojoConfig.lordsAddress,
        entrypoint: "approve",
        calldata: [getContractByName(dojoConfig.manifest, dojoConfig.namespace, "season_systems")?.address, amount * 1e18, "0"]
      },
      {
        contractName: "season_systems",
        entrypoint: "donate_season",
        calldata: [dojoConfig.seasonId, amount, formattedName, formattedSocial]
      }
    ]

    const res = await dojo.executeTx(txs)

    if (res) {
      enqueueSnackbar('Donation successful', { variant: 'success' })
      refresh()
      close(false)
    }
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

            <Typography color='white' variant='h4'>
              Add Donation
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                size="medium"
                type='text'
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  endAdornment: <Typography>$LORDS</Typography>,
                }}
                required
              />

              <TextField
                size="medium"
                type='text'
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                size="medium"
                type='text'
                label="Social"
                placeholder="provablegames"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                InputProps={{
                  startAdornment: <Typography>https://x.com/</Typography>,
                }}
              />

              <Button variant='outlined' onClick={donate} size='large'>
                <Typography color='primary'>
                  Donate
                </Typography>
              </Button>
            </Box>

          </Box>
        </motion.div>
      </Box>
    </Dialog>
  )
}

export default AddDonation

const styles = {
  dialogContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    py: 2,
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