import { motion } from "framer-motion"
import { fadeVariant } from "../../helpers/variants"
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { argent, braavos, useConnect } from "@starknet-react/core";
import { argentWebWalletConnector } from "../../helpers/starknet";
import background from "../../assets/images/cards/blessing_caster.png"
import EmailIcon from '@mui/icons-material/Email';

function ConnectWallet(props) {
  const { connect } = useConnect();

  return (
    <motion.div variants={fadeVariant} exit='exit' animate='enter'>
      <Box sx={styles.container}>

        <Box sx={styles.providerContainer}>
          <Typography color='white' variant='h4'>
            Select a provider
          </Typography>

          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant='outlined' onClick={() => connect({ connector: argent() })} size='large' startIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="#FFE97F" viewBox="0 0 40 36" width="20px"><path d="M24.758 0H14.624a.63.63 0 0 0-.618.63C13.802 10.456 8.822 19.78.252 26.385a.65.65 0 0 0-.135.887l5.93 8.463a.61.61 0 0 0 .87.141c5.36-4.102 9.67-9.051 12.774-14.537 3.104 5.486 7.415 10.435 12.774 14.537a.61.61 0 0 0 .871-.141l5.93-8.463a.653.653 0 0 0-.136-.887C30.56 19.779 25.58 10.454 25.376.63A.63.63 0 0 0 24.758 0"></path></svg>}>
              <Typography color='primary'>
                Connect Argent X
              </Typography>
            </Button>

            <Button variant='outlined' onClick={() => connect({ connector: braavos() })} size='large' startIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="#FFE97F" viewBox="0 0 100 100" width="20px"><path d="M62.705 13.912c.13.221-.043.495-.301.495-5.223 0-9.47 4.136-9.569 9.275a15.7 15.7 0 0 0-5.472-.05c-.127-5.116-4.362-9.225-9.568-9.225-.259 0-.433-.274-.302-.496A14.61 14.61 0 0 1 50.1 6.75a14.61 14.61 0 0 1 12.606 7.162M78.76 45.872c1.512.458 2.942-.867 2.411-2.35-4.757-13.289-19.78-18.718-31.143-18.718-11.384 0-26.741 5.603-31.153 18.787-.493 1.474.933 2.754 2.423 2.297l27.574-8.45a3.5 3.5 0 0 1 2.03-.003z"></path><path d="m18.813 48.17 30.08-9.123c.658-.2 1.36-.2 2.017-.001l30.268 9.13a5.95 5.95 0 0 1 4.233 5.697v27.35C85.294 87.9 79.298 93.25 72.624 93.25H61.542a1.98 1.98 0 0 1-1.983-1.982v-9.59a9.5 9.5 0 0 1 5.692-8.705c4.635-2.028 10.118-4.77 11.15-10.274a3.297 3.297 0 0 0-2.598-3.842c-4.48-.89-9.446-.546-13.646 1.332-4.767 2.133-6.014 5.68-6.476 10.445l-.56 5.132c-.17 1.569-1.642 2.77-3.219 2.77-1.631 0-2.855-1.242-3.031-2.865l-.55-5.037c-.395-4.081-1.112-8.045-5.33-9.932-4.812-2.153-9.648-2.867-14.792-1.845A3.297 3.297 0 0 0 23.6 62.7c1.04 5.552 6.48 8.231 11.15 10.274a9.5 9.5 0 0 1 5.691 8.706v9.587a1.983 1.983 0 0 1-1.982 1.984H27.376c-6.674 0-12.67-5.35-12.787-12.027V53.866a5.95 5.95 0 0 1 4.224-5.695"></path></svg>}>
              <Typography color='primary'>
                Connect Braavos
              </Typography>
            </Button>

            <Stack direction='row' width='100%' alignItems={'center'} justifyContent={'space-between'} my={1}>
              <Divider sx={{ width: '40%' }} />
              <Typography variant='h6'>
                or
              </Typography>
              <Divider sx={{ width: '40%' }} />
            </Stack>

            <Button startIcon={<EmailIcon />} color='warning' variant='outlined' onClick={() => connect({ connector: argentWebWalletConnector })} size='large'>
              <Typography color='#f59100'>
                Login with email
              </Typography>
            </Button>
          </Box>
        </Box>

        <Box display='flex' mr={5} mt={-2}>
          <img alt='' src={background} width={190} />
        </Box>

      </Box>
    </motion.div>
  )
}

export default ConnectWallet

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '100%',
    gap: 10,
    p: 4,
    display: 'flex',
    justifyContent: 'space-between',
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