import React, { useContext, useRef } from 'react'

import { motion, useAnimationControls } from 'framer-motion'
import { BattleContext } from '../../contexts/battleContext'
import { CardSize, types } from '../../helpers/cards'
import SmallCard from '../smallCard'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'

function DraggableCard(props) {
  const { values, dragEnd } = props
  const { card, clientX, clientY, rect, style } = values

  const relX = clientX - rect.left - rect.width / 2
  const relY = clientY - rect.top - rect.height / 2

  const play_threshold = window.innerHeight - 200

  const { enqueueSnackbar } = useSnackbar()
  const controls = useAnimationControls()
  const ref = useRef()

  const battle = useContext(BattleContext)

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, [])

  const mouseUpHandler = (event) => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    event.preventDefault();

    if (event.pageY > play_threshold && event.pageX > window.innerWidth - 150) {
      discardCard(event, values.card)
      return
    }

    if (event.button !== 0 || event.pageY > play_threshold) {
      returnCard(event)
      return
    }

    if (values.card.requiresTarget && battle.state.board.length < 1) {
      if (values.card.type === types.CREATURE) {
        battle.actions.summonCreature(values.card)
      }

      else if (values.card.type === types.SPELL) {
        returnCard(event)
        return enqueueSnackbar('No target available', { variant: 'warning' })
      }
    }

    else if (values.card.requiresTarget) {
      battle.utils.setTargetFriendly(values.card)
    }

    else if (values.card.type === types.CREATURE) {
      battle.actions.summonCreature(values.card)
    }

    else if (values.card.type === types.SPELL) {
      battle.actions.castSpell(values.card)
    }

    dragEnd()
  };

  const mouseMoveHandler = (event) => {
    ref.current.style.transform = `translate(${relX + event.pageX - values.pageX}px, ${relY + event.pageY - values.pageY}px)`;

    if (event.pageY > play_threshold && event.pageX > window.innerWidth - 150) {
      ref.current.style.opacity = 0.5
    } else {
      ref.current.style.opacity = 1
    }

    if (values.card.type === types.CREATURE && values.card.cost <= battle.state.adventurer.energy) {
      if (event.pageY < play_threshold) {
        ref.current.style.border = '1px solid #FFE97F'
      } else {
        ref.current.style.border = '1px solid rgba(255, 255, 255, 0.1)'
      }
    }

    if (values.card.type === types.SPELL) {
      if (event.pageY < play_threshold) {
        ref.current.style.border = '1px solid #FFE97F'
      } else {
        ref.current.style.border = '1px solid rgba(255, 255, 255, 0.1)'
      }
    }

    event.preventDefault();
  };

  const returnCard = (event) => {
    controls.start({
      x: [`${relX + event.pageX - values.pageX}px`, '0px'],
      y: [`${relY + event.pageY - values.pageY}px`, '0px'],
      rotate: [values.style.rotate, values.style.rotate]
    })
  }

  const discardCard = (event, card) => {
    battle.actions.discardCard(card)

    controls.start({
      x: [`${relX + event.pageX - values.pageX}px`],
      y: [`${relY + event.pageY - values.pageY}px`],
      rotate: [0, 180, 360],
      opacity: [0.5, 0.5, 0],
    })
  }

  return <>
    <motion.div
      animate={controls}
      transition={{ type: 'spring', duration: 0.3 }}
      onAnimationComplete={dragEnd}
      style={{
        left: style.left,
        x: clientX - rect.left - rect.width / 2,
        top: style.top,
        y: clientY - rect.top - rect.height / 2,
        ...styles.draggable
      }}
      ref={ref}
    >

      <SmallCard card={card} showStats={card.type === types.CREATURE} />

    </motion.div>
  </>
}

export default DraggableCard

const styles = {
  draggable: {
    userSelect: 'none',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '4px',
    position: 'absolute',
    zIndex: '3',
    height: CardSize.medium.height,
    width: CardSize.medium.width,
    cursor: 'grabbing'
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
}
