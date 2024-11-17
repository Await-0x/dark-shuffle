#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate

cp ../contracts/manifest_dev.json ../client/manifest_dev.json

echo "-----  Started indexer ----- "
torii --world 0x043dd69c43f42ed0a62a1216e9710aaa9508d04579fd1fbec2b4530c55710e48 --http.cors_origins "*"