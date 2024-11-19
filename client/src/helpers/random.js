import { LCG_PRIME, U128_MAX } from './constants';

export function getEntropy(blockHash) {
  let r = BigInt(blockHash) % U128_MAX;

  return r % LCG_PRIME;
}

export function LCG(entropy) {
  let a = 25214903917;
  let c = 11;
  let m = LCG_PRIME;

  return (a * entropy + c) % m;
}

export function getRandomNumber(seed, max) {
  return seed % max + 1;
}