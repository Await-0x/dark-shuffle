export const endOfTurnMonsterEffect = ({
  monster,
  setMonster,
  board,
  damageBoard
}) => {
  if (monster.id === 1) {
    setMonster(prev => ({ ...prev, attack: prev.attack + 2 }));
  }

  else if (monster.id === 2) {
    setMonster(prev => ({ ...prev, health: prev.health + 4 }));
  }

  else if (monster.id === 6) {
    damageBoard(2);
  }
}