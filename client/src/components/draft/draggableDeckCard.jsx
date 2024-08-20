import BookmarkIcon from '@mui/icons-material/Bookmark'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { Box, Typography } from "@mui/material"
import { motion, useAnimationControls } from 'framer-motion'
import { default as React, useContext, useEffect, useRef } from 'react'
import { isBrowser } from 'react-device-detect'
import { DraftContext } from '../../contexts/draftContext'
import { fetch_image, tags } from '../../helpers/cards'
import { levelColors } from '../../helpers/constants'

function DraggableDeckCard(props) {
  const { values, dragEnd } = props
  const { card, clientX, clientY, rect } = values

  const relX = clientX - rect.left - rect.width / 2
  const relY = clientY - rect.top - rect.height / 2

  const controls = useAnimationControls()
  const ref = useRef()

  const draft = useContext(DraftContext)

  const play_threshold_x = isBrowser ? window.innerWidth - 300 : window.innerHeight * 0.65
  const play_threshold_y = isBrowser ? { top: 80, bottom: (Math.max(draft.cards.length, 3) * 40 - 4) + 80 } : {}
  const play_threshold_bench_y = isBrowser ? {
    top: play_threshold_y.bottom + 50,
    bottom: play_threshold_y.bottom + 50 + (Math.max(draft.bench.length, 3) * 40 - 4)
  } : {}

  let draftCard = draft.cards.find(_card => _card.id === card.id)

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, [])

  const mouseUpHandler = (event) => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    event.preventDefault();

    if (!draftCard) {
      if (event.button !== 0 || event.pageX < play_threshold_x || event.pageY < play_threshold_y.top || event.pageY > play_threshold_y.bottom) {
        returnCard(event)
        return
      }

      draft.addCardToDeck(card.id)
    }

    if (draftCard) {
      if (event.button !== 0 || event.pageX < play_threshold_x || event.pageY < play_threshold_bench_y.top || event.pageY > play_threshold_bench_y.bottom) {
        returnCard(event)
        return
      }

      draft.removeCardFromDeck(card.id)
    }

    dragEnd()
  };

  const mouseMoveHandler = (event) => {
    ref.current.style.transform = `translate(${relX + event.pageX - values.pageX}px, ${relY + event.pageY - values.pageY}px)`;

    if (!draftCard) {
      if (event.pageX >= play_threshold_x && event.pageY >= play_threshold_y.top && event.pageY <= play_threshold_y.bottom) {
        ref.current.style.border = '1px solid #FFE97F'
      } else {
        ref.current.style.border = '1px solid rgba(255, 255, 255, 0.24)'
      }
    }

    if (draftCard) {
      if (event.pageX >= play_threshold_x && event.pageY >= play_threshold_bench_y.top && event.pageY <= play_threshold_bench_y.bottom) {
        ref.current.style.border = '1px solid #FFE97F'
      } else {
        ref.current.style.border = '1px solid rgba(255, 255, 255, 0.24)'
      }
    }

    event.preventDefault();
  };

  const returnCard = (event) => {
    controls.start({
      x: [`${relX + event.pageX - values.pageX}px`, '0px'],
      y: [`${relY + event.pageY - values.pageY}px`, '0px'],
    })
  }

  let level = card.level - 1;
  let levelColor = levelColors[Math.floor(level / 3)];
  card.cost = card.tag === tags.RENEWABLE ? Math.max(1, card.cost - (card.level - 1)) : card.cost;

  return <>
    <motion.div
      animate={controls}
      transition={{ type: 'spring', duration: 0.3 }}
      onAnimationComplete={dragEnd}
      style={{
        left: rect.x,
        top: rect.y,
        x: rect.x,
        y: rect.y,
        ...styles.draggable
      }}
      ref={ref}
    >

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

    </motion.div>
  </>
}

export default DraggableDeckCard

const styles = {
  draggable: {
    userSelect: 'none',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    position: 'fixed',
    cursor: 'grabbing',
    overflow: 'hidden',
    boxSizing: 'border-box',
    width: '280px',
    height: '36px',
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px',
  },
  crosshair: {
    height: '60px',
    width: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    pointerEvents: 'none',
    visibility: 'hidden'
  },
  levelContainer: {
    marginTop: '-5px',
    marginRight: '-8px',
    position: 'relative',
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
}
