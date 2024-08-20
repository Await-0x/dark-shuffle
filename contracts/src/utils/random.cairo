use darkshuffle::constants::{CARD_POOL_SIZE, U128_MAX, LCG_PRIME};

use core::{
    array::{SpanTrait, ArrayTrait},
    integer::{u256_try_as_non_zero, U256DivRem},
};

fn get_entropy(felt_to_split: felt252) -> u128 {
    let (_d, r) = U256DivRem::div_rem(
        felt_to_split.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
    );

    r.try_into().unwrap() % LCG_PRIME
}

fn LCG(seed: u128) -> u128 {
    let a = 25214903917;
    let c = 11;
    let m = LCG_PRIME;

    (a * seed + c) % m
}

fn get_random_card_id(seed: u128) -> u16 {
    (seed % CARD_POOL_SIZE.into() + 1).try_into().unwrap()
}

fn get_random_number(seed: u128, range: u16) -> u16 {
    (seed % range.into() + 1).try_into().unwrap()
}