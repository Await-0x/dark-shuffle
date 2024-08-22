export const endOfTurnMonsterEffect = ({
  monster,
  setMonster,
  board,
  damageBoard,
  setAdventurer,
  branch
}) => {
  if (monster.id === 1) {
    setMonster(prev => ({ ...prev, attack: prev.attack + 2 }));
  }

  else if (monster.id === 2) {
    setMonster(prev => ({ ...prev, health: prev.health + 5 + branch }));
  }

  else if (monster.id === 6) {
    damageBoard(branch + 1);
  }

  else if (monster.id === 14) {
    setMonster(prev => ({ ...prev, attack: prev.health }));
  }

  else if (monster.id === 17) {
    setAdventurer(prev => ({ ...prev, burn: prev.burn + 1 }))
  }
}