import { LCG_PRIME, U128_MAX } from './constants';

export function getEntropy(blockHash) {
  let r = BigInt(blockHash) % U128_MAX;

  return r % LCG_PRIME;
}

export function LCG(entropy, variance) {
  let a = BigInt(25214903917);
  let c = BigInt(11);
  let m = LCG_PRIME;

  return (a * entropy + c + BigInt(variance)) % m;
}