import React, { createContext, useState } from "react";

export const AnimationContext = createContext()

let ANIMATION_COUNTER = 1

let START_VALUES = {
  monsterDamaged: null
}

export const AnimationHandler = ({ children }) => {

  const [animations, setAnimations] = useState({ ...START_VALUES })

  const [completed, setCompleted] = useState([])

  const [monsterAnimations, setMonsterAnimations] = useState([])
  const [creatureAnimations, setCreatureAnimations] = useState([])
  const [heroAnimations, setHeroAnimations] = useState([])
  const [boardAnimation, setBoardAnimation] = useState([])

  const resetAnimationHandler = () => {
    setCompleted([])
    setMonsterAnimations([])
    setCreatureAnimations([])
    setHeroAnimations([])
    setBoardAnimation([])
    setAnimations({ ...START_VALUES })
  }

  const addAnimation = (type, animation, animationList) => {
    animation = { id: ANIMATION_COUNTER, ...animation }

    switch (type) {
      case 'creature':
        setCreatureAnimations(prev => [animation, ...prev])
        break
      case 'monster':
        setMonsterAnimations(prev => [animation, ...prev])
        break
      case 'hero':
        setHeroAnimations(prev => [animation, ...prev])
        break
      case 'board':
        setBoardAnimation(animationList)
        break
    }

    ANIMATION_COUNTER += 1
  }

  const animationCompleted = (anim) => {
    setCompleted(prev => [...prev, anim])
  }

  const consumeCompleted = () => {
    setCompleted(prev => prev.slice(1))
  }

  return (
    <AnimationContext.Provider
      value={{
        actions: {
          setAnimations
        },

        state: {
          animations
        },

        completed,
        animationCompleted,
        consumeCompleted,
        addAnimation,
        monsterAnimations,
        setMonsterAnimations,
        creatureAnimations,
        setCreatureAnimations,
        heroAnimations,
        setHeroAnimations,
        resetAnimationHandler,
        boardAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};