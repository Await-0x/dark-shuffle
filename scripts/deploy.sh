#!/bin/bash

cd contracts
source ./scripts/env_variables.sh prod

echo "Build contracts..."
sozo --profile prod build

echo "Deploying world to Realms L3..."
sozo --profile prod migrate apply --name darkshuffle

echo "Deleting previous indexer..."
slot deployments delete darkshuffle torii

echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle torii --version 0.6.0 --world 0x1ea1b9ecad1655ffba513fc73818ce42fbbb36175151ead4a822c0aabb05eab --rpc https://api.cartridge.gg/x/realms/katana/ --start-block 0

echo "Setting up config..."
./scripts/set_writer.sh --interval 1  --mode prod 