#!/bin/bash

cd contracts

echo "Build contracts..."
sozo -P slot build

# Delete previous deployment
slot deployments delete darkshuffle0 katana
slot deployments delete darkshuffle0 torii

# echo "Deploying world to Realms L3..."
slot deployments create darkshuffle0 katana --version v1.0.0-alpha.11 --disable-fee true --block-time 1000 --accounts 10

# echo "Migrating world..."
sozo -P slot migrate plan
sozo -P slot migrate apply

# echo "Setting up remote indexer on slot..."
slot deployments create darkshuffle0 torii --version v1.0.0-alpha.11 --world 0x1daff27c57cad231614299bb448215f8ec880926054c45c4eb9459c34c91a47 --rpc https://api.cartridge.gg/x/darkshuffle0/katana/ --start-block 0 --index-pending true