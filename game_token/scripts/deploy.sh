export STARKNET_RPC="https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/nY2Exo6EOH2Pvtylz1dAgzJ9UxWx7MLn"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x73f78369455ad73aa8d118b048f6071e27ebb7b043163cedca8c649edf69f9d

class_hash=0x0577c3980906c4ed5b48e9a3e957e38137e19926d2327599174097859f9c734a

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
# starkli deploy $class_hash $ds_address
