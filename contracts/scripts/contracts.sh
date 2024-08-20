#!/bin/bash

get_contract_address() {
    local contract_name="$1"
    awk -v name="$contract_name" '
    $1 == "address" { last_address = $3 }  # Store the last seen address
    $1 == "name" && $3 == "\"" name "\"" { print last_address; exit; }  # When name matches, print the last stored address
    ' "$KATANA_TOML_PATH"
}

export SOZO_WORLD="0x8d8e73b20e205f98347501a072701e3b7b55c6048ff78562c025aa8a5571a0"

export BATTLE_SYSTEMS="darkshuffle-battle_systems"

export DRAFT_SYSTEMS="darkshuffle-draft_systems"

export GAME_SYSTEMS="darkshuffle-game_systems"

export NODE_SYSTEMS="darkshuffle-node_systems"

# Display the addresses
echo "-------------------------ADDRESS----------------------------------------"
echo world : $SOZO_WORLD
echo battle : $BATTLE_SYSTEMS
echo draft : $DRAFT_SYSTEMS
echo game : $GAME_SYSTEMS
echo node : $NODE_SYSTEMS
