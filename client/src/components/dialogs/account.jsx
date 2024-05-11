import { Box, Button, Dialog, Typography } from '@mui/material';
import { argent, braavos, useAccount, useConnect } from "@starknet-react/core";
import { useEffect } from "react";
import { argentWebWalletConnector } from "../../helpers/starknet";

function AccountDialog(props) {
  const { open, close } = props
  const { address } = useAccount()
  const { connect } = useConnect();

  useEffect(() => {
    if (address) {
      close(false);
    }
  }, [address, close])

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
          Time to Explore
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant='outlined' onClick={() => connect({ connector: argent() })} size='large'>
            <Typography color='primary'>
              Connect Argent X
            </Typography>
          </Button>

          <Button variant='outlined' onClick={() => connect({ connector: braavos() })} size='large'>
            <Typography color='primary'>
              Connect Braavos
            </Typography>
          </Button>

          <Button variant='outlined' onClick={() => connect({ connector: argentWebWalletConnector })} size='large'>
            <Typography color='primary'>
              Login with email
            </Typography>
          </Button>
        </Box>

      </Box>

    </Dialog>
  )
}

export default AccountDialog

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '500px',
    height: '80vh',
    p: 3,
    gap: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden'
  },
}