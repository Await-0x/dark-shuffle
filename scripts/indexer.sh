#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate apply --name darkshuffle

echo "----- Auth and World Contracts: Set 0.1s ----- "
source scripts/env_variables.sh dev
./scripts/set_config.sh --interval 0.1 --mode dev
cp ../contracts/manifests/dev/manifest.json ../client/manifest.json
cp ../contracts/manifests/prod/manifest.json ../client/prod-manifest.json

echo "-----  Started indexer ----- "
rm torii.db
torii --world 0x02579a62f7c4a0f63e556370fad4d110ba8a63eeae6014cfb6ba2a739b14820f --database torii.db --allowed-origins "*"