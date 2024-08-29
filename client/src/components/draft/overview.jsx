import { Box, Divider, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { isMobile } from 'react-device-detect';
import React, { useContext, useState } from "react"
import { DraftContext } from "../../contexts/draftContext"
import { CARD_DETAILS, CardSize, fetch_image, tags } from "../../helpers/cards"
import Card from "../card"
import { DECK_SIZE, levelColors } from "../../helpers/constants"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DraggableDeckCard from "./draggableDeckCard";

function Overview() {
  const draft = useContext(DraftContext)

  const [showBench, setShowBench] = useState(true)
  const [displayCard, setDisplayCard] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)

  const selectCard = (event, card) => {
    if (selectedCard) {
      return
    }

    setSelectedCard({
      card: card,
      rect: event.target.getBoundingClientRect(),
      pageX: event.pageX,
      pageY: event.pageY,
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  function RenderCard(card) {
    card = CARD_DETAILS(card.cardId, card.id, card.level);

    let level = card.level - 1;
    let levelColor = levelColors[Math.floor(level / 3)] ?? levelColors[4];
    card.cost = card.tag === tags.RENEWABLE ? Math.max(1, card.cost - (card.level - 1)) : card.cost;

    return <motion.div
      style={{ width: '100%', height: '36px', position: 'relative' }}
    >

      <motion.div
        style={{ ...styles.cardWrapper }}
        onHoverStart={() => setDisplayCard(card)}
        onHoverEnd={() => setDisplayCard(null)}
        onPanStart={event => selectCard(event, card)}
      />

      <Box sx={[styles.card, { opacity: selectedCard?.card.id === card.id ? 0 : 1 }]}>
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

        <Box sx={styles.levelContainer}>
          <BookmarkIcon htmlColor={levelColor.bg} fontSize='large' />

          {level % 3 > 0
            ? <StarIcon htmlColor={levelColor.star} sx={{ position: 'absolute', top: '6px', left: '12px', fontSize: '10px' }} />
            : <StarOutlineIcon htmlColor={levelColor.star} sx={{ position: 'absolute', top: '6px', left: '12px', fontSize: '10px', opacity: 0.7 }} />
          }

          {level % 3 > 1
            ? <StarIcon htmlColor={levelColor.star} sx={{ position: 'absolute', top: '15px', left: '12px', fontSize: '10px' }} />
            : <StarOutlineIcon htmlColor={levelColor.star} sx={{ position: 'absolute', top: '15px', left: '12px', fontSize: '10px', opacity: 0.7 }} />
          }
        </Box>
      </Box>

    </motion.div>
  }

  let deckColor = draft.cards.length < DECK_SIZE ? '#59687e' : draft.cards.length > DECK_SIZE ? 'error' : 'primary'
  let dropZoneHeight = (Math.max(draft.cards.length, 3) * 40 - 4) + "px"
  let dropZoneHeightBench = (Math.max(draft.bench.length, 3) * 40 - 4) + "px"

  return <Box sx={styles.container}>
    <Box sx={{ display: 'flex', gap: 1, pl: '2px', boxSizing: 'border-box' }}>
      <Typography color={deckColor} sx={{ letterSpacing: '1px', fontSize: '15px' }}>
        DECK
      </Typography>
      <Typography sx={{ fontSize: '15px' }} color={deckColor}>
        {draft.cards.length}/{DECK_SIZE}
      </Typography>
    </Box>

    {(selectedCard && draft.bench.find(_card => _card.id === selectedCard.card.id))
      ? <Box sx={styles.dropZone} height={dropZoneHeight}>
        <Typography>Add to deck</Typography>
      </Box>
      : <Box sx={[styles.container, { p: 0, minHeight: '116px' }]}>
        {React.Children.toArray(
          draft.cards.sort((a, b) => a.cost - b.cost).map(card => RenderCard(card))
        )}
      </Box>
    }

    <Divider sx={{ mt: 0.5 }} />

    <Box onClick={() => setShowBench(prev => !prev)} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, px: '2px', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer' }}>
      <Typography color={'white'} sx={{ letterSpacing: '1px', fontSize: '14px' }}>
        BENCH ({draft.bench.length})
      </Typography>

      {showBench && <KeyboardArrowUpIcon htmlColor="white" sx={{ fontSize: '24px' }} />}
      {!showBench && <KeyboardArrowDownIcon htmlColor="white" sx={{ fontSize: '24px' }} />}
    </Box>

    {!showBench && <Divider />}

    {(selectedCard && draft.cards.find(_card => _card.id === selectedCard.card.id))
      ? <Box sx={styles.dropZone} height={dropZoneHeightBench}>
        <Typography>Remove from deck</Typography>
      </Box>
      : showBench && React.Children.toArray(
        draft.bench.sort((a, b) => a.cost - b.cost).map(card => RenderCard(card))
      )}

    {displayCard && !selectedCard && <Box sx={isMobile ? styles.mobileDisplayCard : styles.displayCard}>
      <Card card={displayCard} cost={displayCard.cost} />
    </Box>}

    {selectedCard && <DraggableDeckCard
      values={selectedCard}
      dragEnd={() => setSelectedCard(null)}
    />}
  </Box>
}

export default Overview

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    p: 1,
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
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: '2',
  },
  card: {
    overflow: 'hidden',
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
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  mobileDisplayCard: {
    height: CardSize.large.height,
    width: CardSize.large.width,
    position: 'fixed',
    zIndex: 6,
    right: '285px',
    top: 45,
  },
  displayCard: {
    height: CardSize.big.height,
    width: CardSize.big.width,
    position: 'fixed',
    zIndex: 6,
    right: '305px'
  },
  levelContainer: {
    marginTop: '-5px',
    marginRight: '-8px',
    position: 'relative',
  },
  dropZone: {
    width: '100%',
    display: 'flex',
    borderRadius: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px dotted rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    background: '#141920',
    '&:hover': {
      border: '1px solid #FFE97F',
    },
  }
}