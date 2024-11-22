use starknet::{get_block_timestamp, get_tx_info, ContractAddress, contract_address_const, get_contract_address};
use cartridge_vrf::{IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};

use core::{
    integer::{u256_try_as_non_zero, U256DivRem},
};

use darkshuffle::constants::{CARD_POOL_SIZE, U128_MAX, LCG_PRIME, MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID};

fn get_vrf_address() -> ContractAddress {
    contract_address_const::<0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f>()
}

fn get_random_hash() -> felt252 {
    let chain_id = get_tx_info().unbox().chain_id;
    if chain_id == MAINNET_CHAIN_ID || chain_id == SEPOLIA_CHAIN_ID {
        let vrf_provider = IVrfProviderDispatcher { contract_address: get_vrf_address() };
        return vrf_provider.consume_random(Source::Nonce(get_contract_address()));
    }

    let current_timestamp = get_block_timestamp();
    current_timestamp.into()
}

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

fn get_random_card_id(seed: u128) -> u8 {
    let card_number = (seed % 225 + 1).try_into().unwrap();
    
    if card_number > 150 {
        (225 - card_number) / 5 + 61
    } else if card_number > 90 {
        (150 - card_number) / 4 + 46
    } else if card_number > 45 {
        (90 - card_number) / 3 + 31
    } else if card_number > 15 {
        (45 - card_number) / 2 + 16
    } else {
        card_number
    }
}

fn get_random_number(seed: u128, range: u8) -> u8 {
    (seed % range.into() + 1).try_into().unwrap()
}

fn shuffle_deck(seed: u128, deck: Span<u8>, skip: u8) -> Span<u8> {
    let mut card_1 = *deck.at(0);
    let mut card_2 = *deck.at(1);
    let mut card_3 = *deck.at(2);
    let mut card_4 = *deck.at(3);
    let mut card_5 = *deck.at(4);
    let mut card_6 = *deck.at(5);
    let mut card_7 = *deck.at(6);
    let mut card_8 = *deck.at(7);
    let mut card_9 = *deck.at(8);
    let mut card_10 = *deck.at(9);
    let mut card_11 = *deck.at(10);
    let mut card_12 = *deck.at(11);
    let mut card_13 = *deck.at(12);
    let mut card_14 = *deck.at(13);
    let mut card_15 = *deck.at(14);
    let mut card_16 = *deck.at(15);
    let mut card_17 = *deck.at(16);
    let mut card_18 = *deck.at(17);
    let mut card_19 = *deck.at(18);
    let mut card_20 = *deck.at(19);

    let mut temp = 0;
    let mut n: u8 = deck.len().try_into().unwrap();
    let mut rand = seed;

    while n > skip {
        rand = LCG(rand);
        let i: u32 = get_random_number(rand, n - skip).into() + skip.into();

        if n == 20 {
            temp = card_20;
            if i == 20 {
                card_20 = card_20;
                card_20 = temp;
            } else if i == 19 {
                card_20 = card_19;
                card_19 = temp;
            } else if i == 18 {
                card_20 = card_18;
                card_18 = temp;
            } else if i == 17 {
                card_20 = card_17;
                card_17 = temp;
            } else if i == 16 {
                card_20 = card_16;
                card_16 = temp;
            } else if i == 15 {
                card_20 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_20 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_20 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_20 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_20 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_20 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_20 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_20 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_20 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_20 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_20 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_20 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_20 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_20 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_20 = card_1;
                card_1 = temp;
            }
        } else if n == 19 {
            temp = card_19;
            if i == 19 {
                card_19 = card_19;
                card_19 = temp;
            } else if i == 18 {
                card_19 = card_18;
                card_18 = temp;
            } else if i == 17 {
                card_19 = card_17;
                card_17 = temp;
            } else if i == 16 {
                card_19 = card_16;
                card_16 = temp;
            } else if i == 15 {
                card_19 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_19 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_19 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_19 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_19 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_19 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_19 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_19 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_19 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_19 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_19 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_19 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_19 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_19 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_19 = card_1;
                card_1 = temp;
            }
        } else if n == 18 {
            temp = card_18;
            if i == 18 {
                card_18 = card_18;
                card_18 = temp;
            } else if i == 17 {
                card_18 = card_17;
                card_17 = temp;
            } else if i == 16 {
                card_18 = card_16;
                card_16 = temp;
            } else if i == 15 {
                card_18 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_18 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_18 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_18 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_18 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_18 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_18 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_18 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_18 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_18 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_18 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_18 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_18 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_18 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_18 = card_1;
                card_1 = temp;
            }
        } else if n == 17 {
            temp = card_17;
            if i == 17 {
                card_17 = card_17;
                card_17 = temp;
            } else if i == 16 {
                card_17 = card_16;
                card_16 = temp;
            } else if i == 15 {
                card_17 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_17 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_17 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_17 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_17 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_17 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_17 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_17 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_17 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_17 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_17 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_17 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_17 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_17 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_17 = card_1;
                card_1 = temp;
            }
        } else if n == 16 {
            temp = card_16;
            if i == 16 {
                card_16 = card_16;
                card_16 = temp;
            } else if i == 15 {
                card_16 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_16 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_16 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_16 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_16 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_16 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_16 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_16 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_16 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_16 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_16 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_16 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_16 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_16 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_16 = card_1;
                card_1 = temp;
            }
        } else if n == 15 {
            temp = card_15;
            if i == 15 {
                card_15 = card_15;
                card_15 = temp;
            } else if i == 14 {
                card_15 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_15 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_15 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_15 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_15 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_15 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_15 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_15 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_15 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_15 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_15 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_15 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_15 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_15 = card_1;
                card_1 = temp;
            }
        } else if n == 14 {
            temp = card_14;
            if i == 14 {
                card_14 = card_14;
                card_14 = temp;
            } else if i == 13 {
                card_14 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_14 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_14 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_14 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_14 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_14 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_14 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_14 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_14 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_14 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_14 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_14 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_14 = card_1;
                card_1 = temp;
            }
        } else if n == 13 {
            temp = card_13;
            if i == 13 {
                card_13 = card_13;
                card_13 = temp;
            } else if i == 12 {
                card_13 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_13 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_13 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_13 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_13 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_13 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_13 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_13 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_13 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_13 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_13 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_13 = card_1;
                card_1 = temp;
            }
        } else if n == 12 {
            temp = card_12;
            if i == 12 {
                card_12 = card_12;
                card_12 = temp;
            } else if i == 11 {
                card_12 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_12 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_12 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_12 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_12 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_12 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_12 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_12 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_12 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_12 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_12 = card_1;
                card_1 = temp;
            }
        } else if n == 11 {
            temp = card_11;
            if i == 11 {
                card_11 = card_11;
                card_11 = temp;
            } else if i == 10 {
                card_11 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_11 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_11 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_11 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_11 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_11 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_11 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_11 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_11 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_11 = card_1;
                card_1 = temp;
            }
        } else if n == 10 {
            temp = card_10;
            if i == 10 {
                card_10 = card_10;
                card_10 = temp;
            } else if i == 9 {
                card_10 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_10 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_10 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_10 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_10 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_10 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_10 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_10 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_10 = card_1;
                card_1 = temp;
            }
        } else if n == 9 {
            temp = card_9;
            if i == 9 {
                card_9 = card_9;
                card_9 = temp;
            } else if i == 8 {
                card_9 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_9 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_9 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_9 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_9 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_9 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_9 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_9 = card_1;
                card_1 = temp;
            }
        } else if n == 8 {
            temp = card_8;
            if i == 8 {
                card_8 = card_8;
                card_8 = temp;
            } else if i == 7 {
                card_8 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_8 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_8 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_8 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_8 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_8 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_8 = card_1;
                card_1 = temp;
            }
        } else if n == 7 {
            temp = card_7;
            if i == 7 {
                card_7 = card_7;
                card_7 = temp;
            } else if i == 6 {
                card_7 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_7 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_7 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_7 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_7 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_7 = card_1;
                card_1 = temp;
            }
        } else if n == 6 {
            temp = card_6;
            if i == 6 {
                card_6 = card_6;
                card_6 = temp;
            } else if i == 5 {
                card_6 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_6 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_6 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_6 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_6 = card_1;
                card_1 = temp;
            }
        } else if n == 5 {
            temp = card_5;
            if i == 5 {
                card_5 = card_5;
                card_5 = temp;
            } else if i == 4 {
                card_5 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_5 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_5 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_5 = card_1;
                card_1 = temp;
            }
        } else if n == 4 {
            temp = card_4;
            if i == 4 {
                card_4 = card_4;
                card_4 = temp;
            } else if i == 3 {
                card_4 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_4 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_4 = card_1;
                card_1 = temp;
            }
        } else if n == 3 {
            temp = card_3;
            if i == 3 {
                card_3 = card_3;
                card_3 = temp;
            } else if i == 2 {
                card_3 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_3 = card_1;
                card_1 = temp;
            }
        } else if n == 2 {
            temp = card_2;
            if i == 2 {
                card_2 = card_2;
                card_2 = temp;
            } else if i == 1 {
                card_2 = card_1;
                card_1 = temp;
            }
        }

        n -= 1;
    };

    array![card_1, card_2, card_3, card_4, card_5, card_6, card_7, card_8, card_9, card_10, card_11, card_12, card_13, card_14, card_15, card_16, card_17, card_18, card_19, card_20].span()
}