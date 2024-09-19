#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate apply

cp ../contracts/manifests/dev/deployment/manifest.json ../client/dev_manifest.json

echo "-----  Started indexer ----- "
rm torii.db
torii --world 0x1daff27c57cad231614299bb448215f8ec880926054c45c4eb9459c34c91a47 --database torii.db --allowed-origins "*"