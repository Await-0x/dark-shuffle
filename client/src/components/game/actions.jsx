import { Box, Button, Link, Typography } from "@mui/material";
import { BattleContext } from "../../contexts/battleContext";
import React, { useContext } from "react";

function Actions(props) {

  const battle = useContext(BattleContext)

  function actionText(action) {
    switch (action.type) {
      case 'summon':
        return `Play ${action.name}`
      case 'attack':
        return `${action.name} attack`
    }
  }

  return <Box px={2}>

    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
      <Typography variant='h6' color='primary'>
        Actions
      </Typography>
    </Box>

    <Box mt={1} display={'flex'} flexDirection={'column'} gap={0.5}>
      {React.Children.toArray(
        battle.actions.map((action, i) =>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ minWidth: '25px' }}>
              {i + 1}.
            </Typography>
            <Typography>
              {actionText(action)}
            </Typography>
          </Box>
        )
      )}

    </Box>
  </Box>
}

export default Actions

const styles = {

}