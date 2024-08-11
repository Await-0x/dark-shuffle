#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --profile prod build

echo "Deleting previous indexer and network..."
slot deployments delete darkshuffle torii
slot deployments delete darkshuffle katana

# echo "Deploying world to Realms L3..."
slot deployments create darkshuffle katana --version v1.0.0-alpha.4 --disable-fee true --block-time 1000 --accounts 10

# echo "Migrating world..."
sozo --profile prod migrate apply

# echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle torii --version v1.0.0-alpha.4 --world 0x68bd46f4b09cc876e0ac692e1943351eb63b1d95e9406b4c0bff833a9edb0eb --rpc https://api.cartridge.gg/x/darkshuffle/katana/ --start-block 0

# echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod