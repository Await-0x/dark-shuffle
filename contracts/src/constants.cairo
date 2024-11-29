const CARD_POOL_SIZE: u8 = 75;
const DRAFT_SIZE: u8 = 20;
const DECK_SIZE: u8 = 20;

const STARTING_HAND_SIZE: u8 = 5;
const MAX_HAND_SIZE: u8 = 10;

const MAX_BOARD: u8 = 6;
const LAST_NODE_DEPTH: u8 = 6;

const START_HEALTH: u8 = 50;
const MAX_HEALTH: u8 = 50;
const MAX_ENERGY: u8 = 7;

const PRIZES: u8 = 10;
const SEASON_DURATION_SECONDS: u32 = 1209600;

const MAINNET_CHAIN_ID: felt252 = 0x534e5f4d41494e;
const SEPOLIA_CHAIN_ID: felt252 = 0x534e5f5345504f4c4941;
const KATANA_CHAIN_ID: felt252 = 0x4b4154414e41;

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

fn DEFAULT_NS() -> @ByteArray {
    @"darkshuffle"
}