import { Box } from '@mui/material'
import React from 'react'
import { CardSize, CARD_LIST } from '../helpers/cards'
import Card from '../components/card'

function CollectionPage() {

  return (
    <Box sx={styles.container}>

      <Box sx={styles.cards}>
        {React.Children.toArray(
          CARD_LIST.sort((a, b) => a.id - b.id).map(card =>
            <Box sx={styles.cardContainer}>
              <Card card={card} />
            </Box>
          ))}
      </Box>

    </Box >
  )
}

export default CollectionPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    p: 2,
    pb: 10,
    boxSizing: 'border-box',
    overflow: 'scroll'
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContainer: {
    height: CardSize.big.height,
    width: CardSize.big.width,
  }
}