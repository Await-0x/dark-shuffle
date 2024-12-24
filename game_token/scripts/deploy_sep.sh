export STARKNET_RPC="https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/ryBJsdQZcEq8mlzPVYTtIvFGCXcylX1o"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x77c40514d31a722a10961a141d7bbbd479c26c7ba6facab6ae3c11925720465

class_hash=0x050b275a94c329c957156bdcd2073b696e6a4cfc0ac604be526c849148a5c649

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
starkli deploy $class_hash $ds_address
