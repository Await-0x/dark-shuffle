#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --release build

# echo "Deploying world to Realms L3..."
slot deployments create darkshuffle-5 katana --version v1.0.0-alpha.9 --disable-fee true --block-time 1000 --accounts 10

# echo "Migrating world..."
sozo --release migrate apply

# echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle-5 torii --version v1.0.0-alpha.9 --world 0x28e3b965be742337a50b7200524d1d9f01ab950a6c75baf83640bf5541b0894 --rpc https://api.cartridge.gg/x/darkshuffle-5/katana/ --start-block 0 --index-pending true