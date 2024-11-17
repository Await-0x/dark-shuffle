import { Box, Typography } from '@mui/material'
import { CARD_DETAILS } from '../helpers/cards'

export const GET_MONSTER = (monsterId) => {
  let details = CARD_DETAILS(monsterId)

  return {
    id: monsterId,
    monsterId: monsterId,
    name: details.name,
    monsterType: details.creature_type,
    abilities: <>
      <Typography color="primary" variant='h6'>{details.name}</Typography>
      <Typography color="primary" variant='h6'>{details.creature_type}</Typography>
      {getMonsterAbilities(monsterId)}
    </>
  }
}

const getMonsterAbilities = (monsterId) => {
  switch (Number(monsterId)) {
    case 1:
      return <>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography color="primary">★ Rage</Typography>
        </Box>
        <Typography mt={0.5}>
          Gains +2 attack each round.
        </Typography> */}
      </>
    default:
      return <></>
  }
}