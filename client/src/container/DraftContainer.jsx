import { Box, Typography } from '@mui/material'
import { motion } from "framer-motion"
import React, { useContext, useEffect } from 'react'
import BlockRevealAnimation from '../components/animations/blockRevealAnimation'
import Card from '../components/card'
import DraftStats from '../components/draft/draftStats'
import Overview from '../components/draft/overview'
import { DraftContext } from '../contexts/draftContext'
import { GameContext } from '../contexts/gameContext'
import { CardSize } from '../helpers/cards'
import { fadeChildrenContainer, fadeChildrenItem } from '../helpers/variants'

function DraftContainer() {
  const game = useContext(GameContext)
  const draft = useContext(DraftContext)

  const selectCard = (card) => {
    if (draft.pendingCard) return;
    
    draft.selectCard(card)
  }

  useEffect(() => {
    if (game.values.inDraft && game.entropy.blockHash) {
      draft.getDraftOptions()
    }
  }, [game.entropy.blockHash])

  return (
    <Box sx={styles.container}>

      <Box sx={styles.draftContainer}>

        <Box sx={styles.mainContainer}>
          {draft.options.length > 0
            ? <>
              {draft.pendingCard
                ? <Box display={'flex'} alignItems={'baseline'}>
                  <Typography variant='h2' color='primary'>
                    Selecting card
                  </Typography>
                  <div className='dotLoader' style={{ width: '24px' }} />
                </Box>
                : <Typography variant='h2' color='primary'>
                  Select Card
                </Typography>
              }

              <motion.div key={draft.cards.length} style={styles.cards} variants={fadeChildrenContainer} initial="hidden" animate="visible">
                {React.Children.toArray(
                  draft.options.map(card =>
                    <motion.div style={styles.cardContainer}
                      onClick={() => selectCard(card)}
                      variants={fadeChildrenItem}>
                      <Card card={card} pendingCard={draft.pendingCard} />
                    </motion.div>
                  ))}
              </motion.div>
            </>
            : <BlockRevealAnimation icon />
          }
        </Box>

        <Box sx={styles.draftInfo}>
          <DraftStats />
        </Box>

      </Box>

      <Box sx={styles.overview}>
        <Overview />
      </Box>

    </Box>
  )
}

export default DraftContainer

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },

  overview: {
    width: '300px',
    height: '100%'
  },

  draftContainer: {
    height: '100%',
    width: 'calc(100% - 300px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.12)'
  },

  mainContainer: {
    width: '100%',
    height: 'calc(100% - 285px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    pt: 5,
    pb: '150px',
    boxSizing: 'border-box'
  },

  cards: {
    display: 'flex',
    gap: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  draftInfo: {
    minHeight: '230px',
    height: '230px',
    width: '100%'
  },

  cardContainer: {
    height: CardSize.big.height,
    width: CardSize.big.width,
    margin: '0 12px'
  }
}