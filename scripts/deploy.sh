#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --profile prod build

echo "Deleting previous indexer and network..."
slot deployments delete darkshuffle torii
slot deployments delete darkshuffle katana

# echo "Deploying world to Realms L3..."
slot deployments create darkshuffle katana --version v1.0.0-alpha.6 --disable-fee true --block-time 1000 --accounts 10

# echo "Migrating world..."
sozo --profile prod migrate apply

# echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle torii --version v1.0.0-alpha.6 --world 0x8d8e73b20e205f98347501a072701e3b7b55c6048ff78562c025aa8a5571a0 --rpc https://api.cartridge.gg/x/darkshuffle/katana/ --start-block 0

# echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod