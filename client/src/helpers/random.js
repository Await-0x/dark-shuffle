import * as starknet from '@scure/starknet';
import { DECK_SIZE, LCG_PRIME, U128_MAX } from './constants';

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

export function shuffleCards(blockHash, cards) {
  let shuffledDeck = []
  let entropy = getEntropy(blockHash);
  
  while (shuffledDeck.length < DECK_SIZE) {
    entropy = LCG(entropy);

    shuffledDeck.push(cards.splice(Number(entropy % BigInt(cards.length)), 1)[0])
  }

  return shuffledDeck;
}