#!/bin/bash

# Default values (dev)
STARKNET_RPC_URL="http://localhost:5050"
DOJO_ACCOUNT_ADDRESS="0x6162896d1d7ab204c7ccac6dd5f8e9e7c25ecd5ae4fcb4ad32e57786bb46e03"
DOJO_PRIVATE_KEY="0x1800000000300000180000000000030000000000003006001800006600"
DOJO_WORLD_ADDRESS="0x1ea1b9ecad1655ffba513fc73818ce42fbbb36175151ead4a822c0aabb05eab"
KATANA_TOML_PATH="./manifests/dev/manifest.toml"

# Check if the first argument is provided and set it to "dev" or "prod"
if [[ ! -z "$1" ]]; then
    if [[ "$1" == "prod" ]]; then
        echo "is prod"
    elif [[ "$1" != "dev" ]]; then
        echo "Invalid argument. Use 'dev' or 'prod'."
        exit 1
    fi
fi

# Set the environment variables
export STARKNET_RPC_URL
export DOJO_ACCOUNT_ADDRESS
export DOJO_PRIVATE_KEY
export DOJO_WORLD_ADDRESS
export KATANA_TOML_PATH