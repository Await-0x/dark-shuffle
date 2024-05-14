#!/bin/bash

cd contracts

echo "----- Building World -----"
sozo build

echo "----- Migrating World -----"
sozo migrate apply --name darkshuffle

echo "----- Auth and World Contracts: Set 0.1s ----- "
source scripts/env_variables.sh dev
./scripts/set_config.sh --interval 0.1 --mode dev

echo "-----  Started indexer ----- "
torii --world 0x1ea1b9ecad1655ffba513fc73818ce42fbbb36175151ead4a822c0aabb05eab