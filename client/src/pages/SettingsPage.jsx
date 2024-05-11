import { Box, FormGroup, FormControlLabel, Switch } from '@mui/material'
import React, { useContext } from 'react'
import { GameContext } from '../contexts/gameContext'

function SettingsPage() {
  const game = useContext(GameContext)

  return (
    <Box sx={styles.container}>

      <Box sx={styles.settings}>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={game.clientOnly} color='primary' onChange={(event) => game.setClientOnly(event.target.checked)} />
            }
            label="Client Only" />
        </FormGroup>

      </Box>

    </Box >
  )
}

export default SettingsPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    p: 2,
    pb: 10,
    boxSizing: 'border-box',
    overflow: 'scroll'
  },
  settings: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
}