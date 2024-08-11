#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --profile prod build

echo "Deleting previous indexer and network..."
# slot deployments delete darkshuffle torii
# slot deployments delete darkshuffle katana

echo "Deploying world to Realms L3..."
slot deployments create darkshuffle katana --version v1.0.0-alpha.4 --invoke-max-steps 25000000 --disable-fee true --block-time 1000

echo "Migrating world..."
sozo --profile prod migrate apply --name darkshuffle

echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle torii --version v1.0.0-alpha.4 --world 0x7bb7ebdd7e71f60cdc9d411b5069442931990aa4ead38c117f38d77d9cedbfd --rpc https://api.cartridge.gg/x/darkshuffle/katana/ --start-block 0

echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod