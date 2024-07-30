import { Box } from '@mui/material'
import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { _styles } from '../../helpers/styles'

import bigfoot from "../../assets/images/monsters/bigfoot.png"
import chimera from "../../assets/images/monsters/chimera.png"
import kappa from "../../assets/images/monsters/kappa.png"
import lich from "../../assets/images/monsters/lich.png"
import minotaur from "../../assets/images/monsters/minotaur.png"
import spider from "../../assets/images/monsters/spider.png"
import troll from "../../assets/images/monsters/troll.png"
import { fetchCardList, fetch_image } from '../../helpers/cards'

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

  function LoadMonsterImage(src) {
    return <LazyLoadImage
      alt={""}
      height={0}
      src={src}
      width={0}
      onLoad={() => { setIsLoading(prev => prev + 1) }}
    />
  }

  return (
    <Box sx={[_styles.customBox, _styles.linearBg, styles.container]} width={'100%'} height={'150px'}>
      {isLoading < 7 ? <>
        {LoadMonsterImage(troll)}
        {LoadMonsterImage(bigfoot)}
        {LoadMonsterImage(chimera)}
        {LoadMonsterImage(kappa)}
        {LoadMonsterImage(spider)}
        {LoadMonsterImage(lich)}
        {LoadMonsterImage(minotaur)}
      </>

        : <>
          <img alt='' src={minotaur} height={'80%'} />
          <img alt='' src={troll} height={'85%'} />
          <img alt='' src={bigfoot} height={'85%'} />
          <img alt='' src={chimera} height={'85%'} />
          <img alt='' src={kappa} height={'85%'} />
          <img alt='' src={spider} height={'80%'} />
          <img alt='' src={lich} height={'80%'} />

          {PreloadCardImages()}
        </>
      }
    </Box>
  )
}

export default Monsters

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    px: 2,

    animationName: 'fadeInAnimation',
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationIterationCount: '1',
    animationDirection: 'forwards',
  },
}