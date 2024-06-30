#!/bin/bash

# Navigate to the root of the repo to install dependencies
echo "Setting up Katana..."
echo "Building Contracts"

# Change directory to contracts
cd contracts

# Run katana with the disable-fee option
katana --disable-fee --allowed-origins "*" --block-time 1000