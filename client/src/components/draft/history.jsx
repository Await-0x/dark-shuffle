import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { CARD_LIST, CardSize, fetch_image } from '../../helpers/cards';
import { _styles } from '../../helpers/styles';
import { uniquefy } from "../../helpers/utilities";
import Card from "../card";
import React, { useState } from 'react';

let TEST_DATA = [
  {
    id: "0x0072f31a061fe87050dd2a13410267432c428d1d7b8f5624b892b64367114a8d",
    submitted: false,
    battlesWon: 23,
    cards: [3, 2, 4, 1, 5, 6, 1, 2, 3, 9]
  },
  {
    id: "0x0072f31a061fe87050dd2a13410267432c428d1d7b8f5624b892b64367114a8d",
    submitted: true,
    battlesWon: 23,
    cards: [13, 22, 14, 16, 25, 16, 31, 22, 33, 19]
  }
]

function DraftCards(props) {
  const [displayCard, setDisplayCard] = useState(null)

  const uniqueCards = uniquefy(props.cards, "cardId")

  return <>
    {React.Children.toArray(
      uniqueCards.sort((a, b) => a.cost - b.cost).map(card => {
        const count = props.cards.filter(c => c.cardId === card.cardId).length

        return <motion.div style={{ ...styles.card }}
          onHoverStart={() => setDisplayCard(card)}
          onHoverEnd={() => setDisplayCard(null)}>

          <Box display={'flex'} gap={1} height={'100%'} alignItems={'center'}>
            <Box sx={styles.cardCost}>
              <Typography lineHeight={0}>
                {card.cost}
              </Typography>
            </Box>
            <Box height={'90%'}>
              <img alt='' src={fetch_image(card.name)} height={'100%'} />
            </Box>

            <Typography>
              {card.name}
            </Typography>
          </Box>

          <Box sx={styles.count}>
            <Typography color='primary'>
              {count > 1 && count}
            </Typography>
          </Box>

        </motion.div>
      })
    )}

    {displayCard && <Box sx={styles.displayCard}>
      <Card card={displayCard} />
    </Box>}
  </>
}

function DraftHistory(props) {
  return <Box sx={styles.container}>

    <Box width={'100%'} display={'flex'} alignItems={'center'} gap={2} mb={1}>
      <IconButton onClick={props.back}>
        <ArrowBackIcon fontSize='large' color='primary' />
      </IconButton>

      <Typography variant='h4' color='primary'>
        Draft History
      </Typography>
    </Box>

    {React.Children.toArray(
      TEST_DATA.map(game => <Box width={'100%'}>
        <Typography variant='subtitle2' color='rgba(255, 255, 255, 0.5)' mb={1}>
          id: {game.id}
        </Typography>

        <Box sx={[_styles.customBox, _styles.linearBg, styles.gameContainer]} width={'100%'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h6' color='primary'>
              Monsters
            </Typography>

            <Typography variant='h2' color='primary' mb={2}>
              {game.battlesWon}
            </Typography>

            {game.submitted
              ? <Button variant='outlined' color='warning'>
                Submit Score
              </Button>
              : <Typography variant="subtitle1" color="green">
                Score Submitted
              </Typography>
            }
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: 'wrap', maxHeight: '150px' }}>
            <DraftCards cards={game.cards.map(cardId => CARD_LIST.find(card => card.cardId === cardId))} />
          </Box>
        </Box>
      </Box>)
    )}

  </Box>
}

export default DraftHistory

const styles = {
  container: {
    width: '100%',
    height: 'calc(100% - 55px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    p: 4,
    gap: 3,
  },
  gameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    px: 4,
    py: 3,
  },
  cardCost: {
    width: '20px',
    height: '20px',
    borderRadius: '24px',
    border: '1px solid #FFE97F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    boxSizing: 'border-box',
    width: '260px',
    height: '36px',
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  displayCard: {
    height: CardSize.big.height,
    width: CardSize.big.width,
    position: 'absolute',
    right: '300px'
  }
}