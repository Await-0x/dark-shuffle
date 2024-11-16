export const ADVENTURER_ID = 65535;
export const CARD_POOL_SIZE = 39;
export const DRAFT_SIZE = 20;
export const DECK_SIZE = 5;
export const DISCARD_COST = 1;
export const MAX_BOARD = 6;

export const START_ENERGY = 8;
export const START_HEALTH = 50;

export const TOP_NODE_LEVEL = 5;
export const MAX_CARD_LEVEL = 15;

export const U128_MAX = BigInt(340282366920938463463374607431768211455);
export const LCG_PRIME = BigInt(2147483647);

export const GAME_COST = 20
export const GAME_FEE = 2

export const GAME_EFFECTS = {

}

export const BATTLE_EFFECTS = {
  nextSpellReduction: 0,
  nextCardReduction: 0,
  freeDiscard: false,
  damageImmune: false
}

export const levelColors = [
  { bg: '#90EE90', star: '#000' },
  { bg: '#FFFF00', star: '#000' },
  { bg: '#FFA500', star: '#000' },
  { bg: '#FF0000', star: '#000' },
  { bg: '#800080', star: '#FFD700' },
]