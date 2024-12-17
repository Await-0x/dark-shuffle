export STARKNET_RPC="https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/ryBJsdQZcEq8mlzPVYTtIvFGCXcylX1o"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x275c0647b77edd839550f47a199d3460de338e464ff588d441e99aae28e1582

class_hash=0x050b275a94c329c957156bdcd2073b696e6a4cfc0ac604be526c849148a5c649

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
starkli deploy $class_hash $ds_address
