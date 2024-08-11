import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import { Box, Divider, IconButton, List, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { default as React, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { DojoContext } from '../contexts/dojoContext';
import { DraftContext } from '../contexts/draftContext';
import { ellipseAddress } from '../helpers/utilities';
import TestNet from './header/testnet';

const menuItems = [
  {
    name: 'Play Season',
    path: '/',
    icon: <SportsEsportsIcon fontSize='medium' />
  },
  {
    name: 'Cards',
    path: '/library',
    icon: <ViewCarouselIcon fontSize='medium' />
  }
]

function MobileHeader(props) {
  const { connectWallet, showConnectWallet } = props

  const dojo = useContext(DojoContext)
  const draft = useContext(DraftContext)

  const [menu, toggleMenu] = useState(false)
  const [nameDialog, openNameDialog] = useState(false)

  useEffect(() => {
    if (connectWallet) {
      openAccountDialog(0)
      showConnectWallet(false)
    }
  }, [connectWallet])

  return <Box sx={styles.mobileHeader}>
    <Box />

    <Box>
      <IconButton onClick={() => toggleMenu(true)} size='large'>
        <MenuIcon />
      </IconButton>

      <SwipeableDrawer
        anchor={'top'}
        open={menu}
        onClose={() => toggleMenu(false)}
        onOpen={() => toggleMenu(true)}
      >
        <List>
          {menuItems.map(item => {
            return <Link to={item.path} key={item.name} sx={styles.item}>
              <Box sx={styles.content}>
                {item.icon}

                <Typography variant='h6'>
                  {item.name}
                </Typography>
              </Box>
            </Link>
          })}
        </List>

        <Divider />

        <Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} boxSizing={'borderBox'} pr={1}>
            <Box sx={styles.content}>
              <PersonIcon fontSize='medium' />

              <Typography variant='h6'>
                {draft.playerName ?? 'Anonymous'}
              </Typography>
            </Box>


            <IconButton onClick={() => { openNameDialog(true); handleClose() }}>
              <EditIcon fontSize='medium' />
            </IconButton>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} boxSizing={'borderBox'} pr={1}>
            <Box sx={styles.content}>
              <AccountBalanceWalletIcon fontSize="medium" />

              <Typography>
                {dojo.address && ellipseAddress(dojo.address, 4, 8)}
              </Typography>
            </Box>


            <IconButton onClick={() => { dojo.createBurner() }}>
              <RefreshIcon fontSize='medium' />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={styles.content} onClick={() => { window.open("https://github.com/Await-0x/dark-shuffle", "_blank"); }}>
          <GitHubIcon fontSize="medium" />

          <Typography variant='h6'>
            Github
          </Typography>
        </Box>

        <Box sx={styles.content} onClick={() => { window.open("https://discord.gg/v534GSTf9p", "_blank"); }} mb={1}>
          <SportsEsportsIcon fontSize="medium" />

          <Typography variant='h6'>
            Discord
          </Typography>
        </Box>

      </SwipeableDrawer>
    </Box>

    <TestNet open={nameDialog} close={openNameDialog} />
  </Box>
}

export default MobileHeader

const styles = {
  mobileHeader: {
    position: 'fixed',
    top: 0,
    width: '100%',
    margin: 'auto',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pl: 2,
    boxSizing: 'border-box',
    gap: 4,
    zIndex: 999
  },
  item: {
    letterSpacing: '1px',
  },
  logo: {
    cursor: 'pointer',
    height: '100%',
  },
  content: {
    textDecoration: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: '50px',
    px: 2,
    boxSizing: 'border-box'
  },
};