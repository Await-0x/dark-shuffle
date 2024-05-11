import React, { createContext, useEffect, useState } from "react";

export const AnimationContext = createContext()

let ANIMATION_COUNTER = 1

export const AnimationHandler = ({ children }) => {

  const [completed, setCompleted] = useState([])

  const [monsterAnimations, setMonsterAnimations] = useState([])
  const [creatureAnimations, setCreatureAnimations] = useState([])
  const [heroAnimations, setHeroAnimations] = useState([])
  const [damageAnimations, setDamageAnimations] = useState([])
  const [boardAnimation, setBoardAnimation] = useState([])
  const [boardAnimationCounter, setBoardAnimationCounter] = useState(0)

  const resetAnimationHandler = () => {
    setCompleted([])
    setMonsterAnimations([])
    setCreatureAnimations([])
    setHeroAnimations([])
    setDamageAnimations([])
    setBoardAnimation([])
  }

  const addAnimation = (type, animation, animationList) => {
    animation = { id: ANIMATION_COUNTER, ...animation, }

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
      case 'damage':
        setDamageAnimations(prev => [animation, ...prev])
        break
      case 'board':
        setBoardAnimation(animationList)
        break
    }

    ANIMATION_COUNTER += 1
  }

  const damageFinished = (id) => {
    setDamageAnimations(prev => prev.filter(x => x.id !== id))
  }

  const animationCompleted = (anim) => {
    setCompleted(prev => [...prev, anim])
  }

  const consumeCompleted = (animation) => {
    setCompleted(prev => prev.filter((_, i) => i !== prev.findIndex(anim => anim.type === animation)))
  }

  useEffect(() => {
    if (boardAnimationCounter && boardAnimationCounter >= boardAnimation.length) {
      setBoardAnimation([])
      setBoardAnimationCounter(0)
      animationCompleted({ type: 'monsterAbility' })
    }
  }, [boardAnimationCounter])

  const increaseBoardAnimationCounter = () => {
    setBoardAnimationCounter(prev => prev + 1)
  }

  return (
    <AnimationContext.Provider
      value={{
        completed,
        animationCompleted,
        consumeCompleted,
        addAnimation,
        monsterAnimations,
        setMonsterAnimations,
        creatureAnimations,
        setCreatureAnimations,
        damageFinished,
        damageAnimations,
        heroAnimations,
        setHeroAnimations,
        resetAnimationHandler,
        boardAnimation,
        increaseBoardAnimationCounter
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};