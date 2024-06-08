export const endOfTurnMonsterEffect = ({
  monster,
  setMonster,
  board,
  damageBoard
}) => {
  setMonster(prev => ({ ...prev, attack: prev.attack + 1 }));

  if (monster.id === 401) {
    setMonster(prev => ({ ...prev, attack: prev.attack + 1 }));
  }

  else if (monster.id === 402) {
    setMonster(prev => ({ ...prev, health: prev.health + 4 }));
  }

  else if (monster.id === 406) {
    damageBoard(2);
  }
}

export const isAdventurerDead = ({ monster, adventurer }) => {
  let damage = monster.attack;

  if ([401, 407].includes(monster.id)) {
    damage += 1;
  }

  return damage >= adventurer.health
}