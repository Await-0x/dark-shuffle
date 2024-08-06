#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate apply

echo "----- Auth and World Contracts: Set 0.1s ----- "
source scripts/env_variables.sh dev
./scripts/set_writer.sh --interval 0.1  --mode dev

cp ../contracts/manifests/dev/deployment/manifest.json ../client/manifest.json
cp ../contracts/manifests/prod/deployment/manifest.json ../client/prod-manifest.json

echo "-----  Started indexer ----- "
rm torii.db
torii --world 0x68bd46f4b09cc876e0ac692e1943351eb63b1d95e9406b4c0bff833a9edb0eb --database torii.db --allowed-origins "*"