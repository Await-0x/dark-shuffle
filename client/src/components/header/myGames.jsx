import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { DojoContext } from '../../contexts/dojoContext';
import { GameContext } from '../../contexts/gameContext';
import { useSeason } from '../../contexts/seasonContext';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function MyGames(props) {
  const { handleClose, anchorEl } = props

  const { enqueueSnackbar } = useSnackbar()
  const dojo = useContext(DojoContext)
  const game = useContext(GameContext)
  const season = useSeason()

  let pendingGames = season.unverifiedGames.filter(_game => _game.block_number > (season.latestBlock?.block_number ?? 0) - 10)
  let unverifiedGames = season.unverifiedGames.filter(_game => _game.block_number <= (season.latestBlock?.block_number ?? 0) - 10)

  const [verifyInProgress, setVerifyInProgress] = useState(false)
  const [abandonInProgress, setAbandonInProgress] = useState(false)

  const abandonGame = async () => {
    setAbandonInProgress(true)

    const res = await dojo.executeTx([{ contractName: "game_systems", entrypoint: "abandon_game", calldata: [game.values.gameId] }], game.values.isDemo)

    if (res) {
      game.endGame();
    } else {
      enqueueSnackbar('Failed to abandon game', { variant: 'error' });
    }

    handleClose();
    setAbandonInProgress(false)
  }

  const verifyGames = async () => {
    setVerifyInProgress(true)

    const res = await dojo.executeTx(unverifiedGames.map(_game => ({
      contractName: "game_systems",
      entrypoint: "verify_game",
      calldata: [_game.game_id]
    })))

    if (res) {
      const gameValues = res.find(e => e.componentName === 'Game')

      if (gameValues.entropyVerified) {
        enqueueSnackbar('Games verified', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to verify games', { variant: 'error' });
      }
    }

    handleClose();
    season.fetchUnverifiedGames()
    setVerifyInProgress(false)
  }

  return (
    <>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} sx={styles.menu}>

        <MenuItem>
          <ListItemIcon>
            <HourglassEmptyIcon fontSize="small" color='secondary' />
          </ListItemIcon>
          <ListItemText>
            <Typography color='secondary' fontSize={'13px'}>
              {pendingGames.length} Games Pending
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        {unverifiedGames.length > 0 && (
          <>
            <MenuItem>
              <ListItemText>
                <Typography color='primary' fontSize={'13px'} mb={'4px'}>
                  {unverifiedGames.length} {unverifiedGames.length === 1 ? 'Game' : 'Games'} Unverified
                </Typography>
                <LoadingButton variant='outlined' color='primary' onClick={verifyGames} loading={verifyInProgress}>
                  Verify Games
                </LoadingButton>
              </ListItemText>
            </MenuItem>
          </>
        )}

        {season.unverifiedGames.length == 0 && (
          <MenuItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon fontSize="small" color='primary' />
            </ListItemIcon>
            <ListItemText>
              <Typography color='primary' fontSize={'13px'}>
                All Games Verified
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={abandonGame} disabled={!game.values.gameId || abandonInProgress}>
          <ListItemIcon>
            <RemoveCircleOutlineIcon fontSize="small" color='error' />
          </ListItemIcon>
          <ListItemText>
            <Typography fontSize={'13px'}>
              Abandon Game
            </Typography>
          </ListItemText>
        </MenuItem>

      </Menu>
    </>
  );
}

export default MyGames

const styles = {
  menu: {
    width: 300
  }
};