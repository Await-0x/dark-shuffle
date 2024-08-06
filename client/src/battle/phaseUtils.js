export const endOfTurnMonsterEffect = ({
  monster,
  setMonster,
  board,
  damageBoard
}) => {
  setMonster(prev => ({ ...prev, attack: prev.attack + 1 }));

  if (monster.id === 1) {
    setMonster(prev => ({ ...prev, attack: prev.attack + 1 }));
  }

  else if (monster.id === 2) {
    setMonster(prev => ({ ...prev, health: prev.health + 4 }));
  }

  else if (monster.id === 6) {
    damageBoard(2);
  }
}

export const isAdventurerDead = ({ monster, adventurer }) => {
  let damage = monster.attack;

  if ([1, 7].includes(monster.id)) {
    damage += 1;
  }

  return damage >= adventurer.health
}