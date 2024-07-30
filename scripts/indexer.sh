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
torii --world 0x2ac6157b9cf3fa800073c7d37f633538e6bf408024aa21d52b1875b1968d750 --database torii.db --allowed-origins "*"