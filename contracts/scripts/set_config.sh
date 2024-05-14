#!/bin/bash

source ./scripts/contracts.sh

# Initialize variables
mode=""
delay=0

# Function to show usage
usage() {
    echo "Usage: $0 --mode [prod|dev] [--interval delay]"
    exit 1
}

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --mode) mode="${2:-}"; shift 2;;
        --interval) delay="${2:-}"; shift 2;;
        *) usage;;
    esac
done

# Validate mode
if [[ "$mode" != "prod" && "$mode" != "dev" ]]; then
    echo "Error: Invalid mode specified. Please use prod or dev."
    usage
fi

./scripts/set_writer.sh --interval $delay  --mode $mode
