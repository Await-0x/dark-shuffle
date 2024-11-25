export const endOfTurnMonsterEffect = ({
  values, setHand, setBoard, damageHero, hand
}) => {
  if (values.monsterId === 2) {
    damageHero(hand.length)
  }
}
