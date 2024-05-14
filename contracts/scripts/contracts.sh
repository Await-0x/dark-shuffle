#!/bin/bash

get_contract_address() {
    local contract_name="$1"
    awk -v name="$contract_name" '
    $1 == "address" { last_address = $3 }  # Store the last seen address
    $1 == "name" && $3 == "\"" name "\"" { print last_address; exit; }  # When name matches, print the last stored address
    ' "$KATANA_TOML_PATH"
}

export SOZO_WORLD=$(get_contract_address "dojo::world::world")

export BATTLE_SYSTEMS=$(get_contract_address "darkshuffle::systems::battle::contracts::battle_systems")

export DRAFT_SYSTEMS=$(get_contract_address "darkshuffle::systems::draft::contracts::draft_systems")

export GAME_SYSTEMS=$(get_contract_address "darkshuffle::systems::draft::contracts::game_systems")
