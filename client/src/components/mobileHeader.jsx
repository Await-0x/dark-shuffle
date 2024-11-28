import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import XIcon from '@mui/icons-material/X';
import { Box, Divider, IconButton, List, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { default as React, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DojoContext } from '../contexts/dojoContext';
import { ellipseAddress } from '../helpers/utilities';

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
  const dojo = useContext(DojoContext)

  const [menu, toggleMenu] = useState(false)

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

        <Box sx={styles.content} onClick={() => { window.open("https://twitter.com/await_0x", "_blank"); }} mb={1}>
          <XIcon fontSize="medium" />

          <Typography variant='h6'>
            Twitter
          </Typography>
        </Box>

      </SwipeableDrawer>
    </Box>
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