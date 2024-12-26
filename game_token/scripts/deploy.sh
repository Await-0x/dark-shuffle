export STARKNET_RPC="https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/nY2Exo6EOH2Pvtylz1dAgzJ9UxWx7MLn"
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json

ds_address=0x06caab3213a31495f8d83850b1795a2521f8155f54bfd93214dec2753ead39b5

class_hash=0x050b275a94c329c957156bdcd2073b696e6a4cfc0ac604be526c849148a5c649

scarb build
# starkli declare target/dev/dsgt_DarkShuffleGameToken.contract_class.json
starkli deploy $class_hash $ds_address
