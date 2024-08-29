#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --release build

# echo "Deleting previous indexer and network..."
# slot deployments delete darkshuffle-2 torii
# slot deployments delete darkshuffle-2 katana

# echo "Deploying world to Realms L3..."
slot deployments create darkshuffle-4 katana --version v1.0.0-alpha.6 --disable-fee true --block-time 1000 --accounts 10

# echo "Migrating world..."
sozo --release migrate apply

# echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle-4 torii --version v1.0.0-alpha.6 --world 0x8d8e73b20e205f98347501a072701e3b7b55c6048ff78562c025aa8a5571a0 --rpc https://api.cartridge.gg/x/darkshuffle-4/katana/ --start-block 0 --index-pending true

echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod