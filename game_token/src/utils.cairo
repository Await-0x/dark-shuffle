use alexandria_math::{BitShift, pow};
use core::byte_array::ByteArrayTrait;
use graffiti::json::Builder;
use graffiti::json::JsonImpl;

const BYTE_LEN: u256 = 8; // a byte is 8 bits
const MASK_1_BYTE: u256 = 0xff;
const MASK_2_BYTES: u256 = 0xffff;

const URL_PART_LEN: u32 = 23; // i.e 46 /2


pub fn make_json_and_base64_encode_metadata(name_and_attrs: felt252, url: ByteArray) -> ByteArray {
    let original_name_and_attrs: u256 = name_and_attrs.into();
    format!("data:application/json;base64,{}", bytes_base64_encode(metadata.build()))
}