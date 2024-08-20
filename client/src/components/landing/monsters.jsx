import { Box } from '@mui/material'
import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { fetchCardList, fetch_image } from '../../helpers/cards'
import { _styles } from '../../helpers/styles'

import { fetchMonsterImage, fetchMonsterList } from '../../battle/monsterUtils'
import { shuffle } from '../../helpers/utilities'

function PreloadCardImages() {
  return <>
    {React.Children.toArray(
      fetchCardList().map(card =>
        <LazyLoadImage
          alt={""}
          height={0}
          src={fetch_image(card.name)}
          width={0}
        />
      ))}
  </>
}

function Monsters() {
  const [isLoading, setIsLoading] = useState(0);
  const [monsters] = useState(shuffle(fetchMonsterList()));

  function PreloadMonsterImages(monsters) {
    return <>
      {React.Children.toArray(
        monsters.map(monster =>
          <LazyLoadImage
            alt={""}
            height={0}
            src={fetchMonsterImage(monster.name)}
            width={0}
            onLoad={() => { setIsLoading(prev => prev + 1) }}
          />
        ))}
    </>
  }

  return (
    <Box sx={[_styles.customBox, _styles.linearBg, styles.container]} width={'100%'} height={'150px'}>
      {isLoading < 9
        ? PreloadMonsterImages(monsters.slice(9))

        : <>
          {React.Children.toArray(
            monsters.slice(0, 9).map(monster => <img alt='' src={fetchMonsterImage(monster.name)} height={'80%'} />)
          )}

          {PreloadCardImages()}
          {PreloadMonsterImages(monsters.slice(9))}
        </>}
    </Box>
  )
}

export default Monsters

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    px: 2,

    animationName: 'fadeInAnimation',
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationIterationCount: '1',
    animationDirection: 'forwards',
  },
}