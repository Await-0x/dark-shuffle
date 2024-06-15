#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --profile prod build

echo "Deploying world to Realms L3..."
sozo --profile prod migrate apply --name darkshuffle2

echo "Deleting previous indexer..."
slot deployments delete darkshuffle3 torii

echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle3 torii --version 0.6.0 --world 0x7bb7ebdd7e71f60cdc9d411b5069442931990aa4ead38c117f38d77d9cedbfd --rpc https://api.cartridge.gg/x/realms/katana/ --start-block 0

echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod 