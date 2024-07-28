#!/bin/bash

# Default values (dev)
STARKNET_RPC_URL="http://localhost:5050"
DOJO_ACCOUNT_ADDRESS="0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca"
DOJO_PRIVATE_KEY="0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a"
SOZO_WORLD="0x02579a62f7c4a0f63e556370fad4d110ba8a63eeae6014cfb6ba2a739b14820f"
KATANA_TOML_PATH="./manifests/dev/manifest.toml"

# Check if the first argument is provided and set it to "dev" or "prod"
if [[ ! -z "$1" ]]; then
    if [[ "$1" == "prod" ]]; then
        echo "is prod"
        STARKNET_RPC_URL="https://api.cartridge.gg/x/darkshuffle/katana/"
        DOJO_ACCOUNT_ADDRESS="0x1ac9ffb92ef2b848b6b9feb8a06b9c3311077007e9075517fe629165f8c111"
        DOJO_PRIVATE_KEY="0x4aa974632b58a8946752d559f2b061b8fc9949c2006c8ca2429e27a2584341c"
        SOZO_WORLD="0x7bb7ebdd7e71f60cdc9d411b5069442931990aa4ead38c117f38d77d9cedbfd"
        KATANA_TOML_PATH="./manifests/prod/manifest.toml"
    elif [[ "$1" != "dev" ]]; then
        echo "Invalid argument. Use 'dev' or 'prod'."
        exit 1
    fi
fi

# Set the environment variables
export STARKNET_RPC_URL
export DOJO_ACCOUNT_ADDRESS
export DOJO_PRIVATE_KEY
export SOZO_WORLD
export KATANA_TOML_PATH