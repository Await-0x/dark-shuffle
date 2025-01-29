export STARKNET_RPC="https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/ryBJsdQZcEq8mlzPVYTtIvFGCXcylX1o"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x7bd5325f5d414ae762cdd6665e5316f99b7a1365091594afc10a07f2caaf605

class_hash=0x0051cb810171a1afe6ce10ef7f77277c1ffdfe01a8ff1f6ab6b7152d536676cc

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
starkli deploy $class_hash $ds_address
