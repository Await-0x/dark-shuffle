const CARD_POOL_SIZE: u16 = 39;
const DRAFT_SIZE: u8 = 8;
const DECK_SIZE: u8 = 5;
const DISCARD_COST: u8 = 1;
const MAX_BOARD: u8 = 6;
const MONSTER_COUNT: u16 = 21;
const LAST_NODE_LEVEL: u8 = 6;
const MAX_CARD_LEVEL: u16 = 15;

const START_ENERGY: u16 = 8;
const START_HEALTH: u16 = 50;

const MONSTER_KILL_SCORE: u16 = 100;
const BRANCH_SCORE_MULTIPLIER: u16 = 5;

const PRIZES: u8 = 10;
const SEASON_DURATION_SECONDS: u32 = 1209600;

const MAINNET_CHAIN_ID: felt252 = 0x534e5f4d41494e;
const SEPOLIA_CHAIN_ID: felt252 = 0x534e5f5345504f4c4941;
const KATANA_CHAIN_ID: felt252 = 0x4b4154414e41;

mod CardTypes {
    const CREATURE: felt252 = 'Creature'; 
    const SPELL: felt252 = 'Spell';
}

mod CardTags {
    const RENEWABLE: felt252 = 'Renewable';
    const SCALABLE: felt252 = 'Scalable';
    const ESCALATING: felt252 = 'Escalating';
    const FATIQUE: felt252 = 'Fatique';
    const UNSTABLE: felt252 = 'Unstable';
    const NONE: felt252 = 'None';
}

mod ActionTypes {
    const SUMMON_CREATURE: felt252 = 'summon_creature';
    const CAST_SPELL: felt252 = 'cast_spell';
    const ATTACK: felt252 = 'attack';
    const DISCARD: felt252 = 'discard';
}

mod Messages {
    const NOT_OWNER: felt252 = 'Not authorized to act';
    const NOT_IN_DRAFT: felt252 = 'Not in draft';
    const GAME_OVER: felt252 = 'Game over';
    const IN_BATTLE: felt252 = 'Already in battle';
    const IN_DRAFT: felt252 = 'Draft not over';
    const BLOCK_REVEAL: felt252 = 'Block not revealed';
    const SCORE_SUBMITTED: felt252 = 'Score already submitted';
}

const U128_MAX: u128 = 340282366920938463463374607431768211455;
const LCG_PRIME: u128 = 281474976710656;