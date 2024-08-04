import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import sword from '../assets/images/sword.png';
import { tagExplainer, fetch_image, types } from "../helpers/cards";
import { CustomTooltip } from '../helpers/styles';
import bolt from "../assets/images/bolt.png";
import { levelColors } from '../helpers/constants';

function Card(props) {
  const { card, pendingCard, cost } = props
  const [tooltip, showTooltip] = useState(false)

  useEffect(() => {
    setTimeout(() => showTooltip(true), 1000);
  }, [])

  let level = card.level - 1
  let levelColor = levelColors[Math.floor(level / 3)]

  return <CustomTooltip position={'bottom'} title={card.tag && tooltip ?
    <Box>
      <Typography color="primary">{card.tag}</Typography>
      <Typography mt={0.5} fontSize={'13px'}>{tagExplainer(card.tag)}</Typography>
    </Box>
    : false
  }>
    <Box sx={[styles.container, { opacity: (pendingCard && pendingCard !== card.id) ? 0.3 : 1 }]}>

      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', }}>
          <Typography variant="h5">
            {cost || card.cost}
          </Typography>

          <img alt='' src={bolt} height={20} style={{ marginLeft: '-1px' }} />
        </Box>

        <Typography noWrap>
          {card.name}
        </Typography>

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

      <Box sx={styles.imageContainer}>
        <img alt='' src={fetch_image(card.name)} height={'100%'} />
      </Box>

      <Box sx={styles.textContainer}>
        <Typography sx={{ opacity: 0.9 }} textAlign={'center'} fontSize={'13px'}>
          {card.text}
        </Typography>
      </Box>

      {card.type === types.CREATURE && <Box sx={styles.bottomContainer}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {card.attack}
          </Typography>

          <img alt='' src={sword} height={24} width={24} />
        </Box>

        <Box>
          <Typography variant="subtitle1">
            {card.tag}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">
            {card.health}
          </Typography>

          <FavoriteIcon htmlColor="red" />
        </Box>
      </Box>}

      {card.type === types.SPELL && <Box sx={styles.bottomContainer}>
        <Box />

        <Typography variant="subtitle1">
          {card.tag}
        </Typography>

        <Box />
      </Box>}

    </Box >
  </CustomTooltip>
}

export default Card

const styles = {
  container: {
    position: 'relative',
    zIndex: 5,
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    p: 1.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: '0.3s',
    borderRadius: '4px',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.6)',
    },
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '40%'
  },
  textContainer: {
    width: '100%',
    height: '30%',
    border: '1px solid #FFE97F70',
    borderRadius: '4px',
    padding: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    background: 'rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '18px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  chip: {
    background: '#1F1E1F',
    border: '1px solid #FFE97F',
    borderRadius: '10px',
    padding: '2px 12px',
    display: 'flex'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '30px'
  },
  circle: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px'
  },
  levelContainer: {
    marginTop: '-20px',
    marginRight: '-10px',
    position: 'relative'
  }
}