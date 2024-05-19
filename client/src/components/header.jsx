import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Typography } from '@mui/material';
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/images/logo.png';
import { ellipseAddress } from '../helpers/utilities';
import OnboardingWizard from './header/onboardingWizard';
import ProfileMenu from './header/profileMenu';
import GitHubIcon from '@mui/icons-material/GitHub';

const menuItems = [
  {
    name: 'Play Season',
    path: '/',
    icon: <InfoIcon />
  },
  {
    name: 'Collection',
    path: '/library',
    icon: <InfoIcon />
  }
]

function Header(props) {
  const { connectWallet, showConnectWallet } = props
  const { address } = useAccount()
  
  const [accountDialog, openAccountDialog] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (connectWallet) {
      openAccountDialog(0)
      showConnectWallet(false)
    }
  }, [connectWallet])

  return (
    <Box sx={styles.header}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box height={32} sx={{ opacity: 0.9 }}>
          <img alt='' src={logo} height='32' />
        </Box>

        {menuItems.map(item => {
          return <Link to={item.path} key={item.name} sx={styles.item}>
            <Box sx={styles.content}>
              <Typography>
                {item.name}
              </Typography>
            </Box>
          </Link>
        })}
      </Box>

      <Box display={'flex'} gap={4} alignItems={'center'}>
        {address
          ? <Button onClick={handleClick} endIcon={<PersonIcon fontSize='large' />} size='large'>
            <Typography color='primary' sx={{ fontSize: '12px' }}>
              {ellipseAddress(address, 4, 4)}
            </Typography>
          </Button>

          : <Button variant='outlined' onClick={() => openAccountDialog(0)} sx={{ width: '130px', height: '32px' }}>
            <Typography color='primary' sx={{ fontSize: '13px', letterSpacing: '1px' }}>
              CONNECT
            </Typography>
          </Button>
        }

        <a href="https://github.com/Await-0x/dark-shuffle" target='_blank'>
          <GitHubIcon color='primary' fontSize='large' />
        </a>
      </Box>

      <ProfileMenu handleClose={handleClose} anchorEl={anchorEl} openAccountDialog={openAccountDialog} />
      <OnboardingWizard open={accountDialog !== false} close={openAccountDialog} step={accountDialog || 0} />
    </Box>
  );
}

export default Header

const styles = {
  header: {
    width: '100%',
    height: '55px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 4,
    boxSizing: 'border-box',
    gap: 4
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
  },
  menu: {
    width: 300
  }
};