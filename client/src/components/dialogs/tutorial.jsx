import React, { useState } from 'react'
import { Box, Dialog, Typography } from '@mui/material';
import { CardSize, fetchCardList } from '../../helpers/cards';
import Card from '../card';

function TutorialDialog(props) {
  const { open, close } = props

  const [step, setStep] = useState(0)

  const RenderDraftPhase = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        <Typography color='primary' variant='h2'>
          1. Drafting Phase
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {React.Children.toArray(
            fetchCardList().slice(10, 13).map(card => {
              return <Box sx={styles.cardContainer}>
                <Card card={card} />
              </Box>
            }))}
        </Box>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={() => close(false)}
      maxWidth={'lg'}
      PaperProps={{
        sx: { background: 'rgba(0, 0, 0, 0.98)', border: '1px solid rgba(255, 255, 255, 0.5)' }
      }}
    >

      <Box sx={styles.container}>

        {step === 0 && <RenderDraftPhase />}


      </Box>

    </Dialog>
  )
}

export default TutorialDialog

const styles = {
  container: {
    boxSizing: 'border-box',
    width: '1000px',
    height: '660px',
    py: 4,
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  guideRow: {
    width: '100%',
    height: '200px',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  cardContainer: {
    height: '300px',
    width: '240px',
    margin: '0 12px'
  },
  card: {
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.24)',
    borderRadius: '4px',
    width: '200px',
    display: 'flex',
    alignItems: 'center',
    p: 1,
    gap: 2
  },
  circle: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100px'
  },
  deck: {
    background: '#141920',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    height: '80px',
    width: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    boxShadow: `rgba(255, 233, 127, 0.35) 0px 5px 15px`,
    animation: 'animateGlow 2.5s linear infinite',
    cursor: 'pointer'
  },
  cardCount: {
    width: '32px',
    height: '32px',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  levelContainer: {
    marginTop: '-5px',
    marginRight: '-8px',
    position: 'relative',
  }
}