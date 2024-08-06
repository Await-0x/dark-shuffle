import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { DojoContext } from '../../contexts/dojoContext';
import { DraftContext } from '../../contexts/draftContext';
import { ellipseAddress } from '../../helpers/utilities';

function ProfileMenu(props) {
  const { handleClose, anchorEl, openAccountDialog, openNameDialog } = props

  const dojo = useContext(DojoContext)
  const draft = useContext(DraftContext)

  return (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={styles.menu}>
        <Box width={260} mt={1} display={'flex'} flexDirection={'column'} gap={0.5}>
          <Box px={2} display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={0.5}>
            <Typography color='primary' variant='h6'>
              Game Account
            </Typography>

            <Box display={'flex'} gap={0.5} alignItems={'center'}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FFE97F" height={14}><path d="M0 12v2h1v2h6V4h2v12h6v-2h1v-2h-2v2h-3V4h2V0h-2v2H9V0H7v2H5V0H3v4h2v10H2v-2z"></path></svg>
              <Typography color={'primary'} sx={{ fontSize: '13px' }}>
                0
              </Typography>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} boxSizing={'borderBox'} px={2}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <PersonIcon fontSize='small' />

              <Typography>
                {draft.playerName ?? 'Anonymous'}
              </Typography>
            </Box>


            <IconButton onClick={() => { openNameDialog(true); handleClose() }}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} boxSizing={'borderBox'} px={2}>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <AccountBalanceWalletIcon fontSize="small" />

              <Typography sx={{ fontSize: '12px' }}>
                {dojo.address && ellipseAddress(dojo.address, 4, 8)}
              </Typography>
            </Box>


            <IconButton onClick={() => { dojo.createBurner() }}>
              <RefreshIcon fontSize='small' />
            </IconButton>
          </Box>

          {/* <MenuItem onClick={() => { openAccountDialog(2); handleClose() }}>
            <ListItemIcon>
              <AccountBalanceWalletIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Add Funds
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Copy address
            </ListItemText>
          </MenuItem> */}
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={() => { window.open("https://github.com/Await-0x/dark-shuffle", "_blank"); handleClose; }}>
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Github
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { window.open("https://discord.gg/v534GSTf9p", "_blank"); handleClose; }}>
          <ListItemIcon>
            <SportsEsportsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Discord
          </ListItemText>
        </MenuItem>

        <Divider sx={{ my: 2 }} />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Disconnect
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu

const styles = {
  menu: {
    width: 300
  }
};