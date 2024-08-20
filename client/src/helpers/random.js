import { LCG_PRIME, U128_MAX } from './constants';

export function getEntropy(blockHash) {
  let r = BigInt(blockHash) % U128_MAX;

  return r % LCG_PRIME;
}

export function LCG(entropy) {
  let a = BigInt(48271);
  let c = BigInt(0);
  let m = LCG_PRIME;

  return (a * entropy + c) % m;
}