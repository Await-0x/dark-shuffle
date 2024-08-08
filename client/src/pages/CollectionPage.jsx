import { Box } from '@mui/material'
import React from 'react'
import Card from '../components/card'
import { CardSize, fetchCardList } from '../helpers/cards'
import { Scrollbars } from 'react-custom-scrollbars';

function CollectionPage() {
  return (
    <Box sx={styles.container}>
      <Scrollbars style={{ width: '100%', height: '100%' }}>

        <Box sx={styles.cards}>
          {React.Children.toArray(
            fetchCardList().sort((a, b) => a.id - b.id).map(card => {
              return <Box sx={styles.cardContainer}>
                <Card card={card} />
              </Box>
            }
            ))}
        </Box>

      </Scrollbars >
    </Box>
  )
}

export default CollectionPage

const styles = {
  container: {
    width: '100%',
    height: '100%',
    p: 2,
    pb: 10,
    boxSizing: 'border-box'
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