#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate apply

cp ../contracts/manifests/dev/deployment/manifest.json ../client/manifest.json

echo "-----  Started indexer ----- "
rm torii.db
torii --world 0x28e3b965be742337a50b7200524d1d9f01ab950a6c75baf83640bf5541b0894 --database torii.db --allowed-origins "*"