export STARKNET_RPC="https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/ryBJsdQZcEq8mlzPVYTtIvFGCXcylX1o"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x73f78369455ad73aa8d118b048f6071e27ebb7b043163cedca8c649edf69f9d

class_hash=0x05b699c70144878e634521620b1e533c17db5de34cdc5c08dfcc416e243c87b0

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
starkli deploy $class_hash $ds_address
