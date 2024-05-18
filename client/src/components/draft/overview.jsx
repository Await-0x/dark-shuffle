import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"
import React, { useContext, useState } from "react"
import { DraftContext } from "../../contexts/draftContext"
import { CardSize, fetch_image } from "../../helpers/cards"
import { uniquefy } from "../../helpers/utilities"
import Card from "../card"

function Overview() {
  const draft = useContext(DraftContext)

  const [displayCard, setDisplayCard] = useState(null)

  const uniqueCards = uniquefy(draft.cards, "cardId")

  return <Box sx={styles.container}>

    {React.Children.toArray(
      uniqueCards.map(card => {
        const count = draft.cards.filter(c => c.cardId === card.cardId).length

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
  </Box>
}

export default Overview

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    p: 1
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
    width: '100%',
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
    right: '305px'
  }
}