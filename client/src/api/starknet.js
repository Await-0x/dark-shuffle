import { RpcProvider, Account, CallData, ec, hash, stark, num } from "starknet";
import { dojoConfig } from "../../dojo.config";

export const getLatestBlock = async () => {
  const rpcUrl = import.meta.env.VITE_PUBLIC_NODE_URL;

  try {
    const requestBody = {
      jsonrpc: "2.0",
      method: "starknet_blockHashAndNumber",
      id: 1,
    };
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error getting current block", error);
  }
};

export const getBlockWithTxs = async (blockNumber) => {
  const rpcUrl = import.meta.env.VITE_PUBLIC_NODE_URL;

  try {
    const requestBody = {
      jsonrpc: "2.0",
      method: "starknet_getBlockWithTxHashes",
      params: [{ block_number: blockNumber }],
      id: 1,
    };
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const createBurnerAccount = async (rpcProvider) => {
  const privateKey = stark.randomAddress();
  const publicKey = ec.starkCurve.getStarkKey(privateKey);

  const accountClassHash = dojoConfig.accountClassHash
  // Calculate future address of the account
  const constructorCalldata = CallData.compile({ publicKey });
  const contractAddress = hash.calculateContractAddressFromHash(
    publicKey,
    accountClassHash,
    constructorCalldata,
    0
  );

  const account = new Account(rpcProvider, contractAddress, privateKey, "1");
  const { transaction_hash, contract_address } = await account.deployAccount({
    classHash: accountClassHash,
    constructorCalldata: constructorCalldata,
    addressSalt: publicKey,
  }, {
    version: "0x1",
    nonce: num.toHex(0),
    maxFee: num.toHex(0),
  });

  const receipt = await account.waitForTransaction(transaction_hash, { retryInterval: 100 });

  if (receipt) {
    localStorage.setItem('burner', JSON.stringify({ address: contractAddress, privateKey, version: dojoConfig.version }))
    return account
  }
};

export const fetchBalances = async (account, ethContract, lordsContract) => {
  const ethResult = await ethContract?.call(
    "balanceOf",
    CallData.compile({ account })
  );

  const lordsBalanceResult = await lordsContract?.call(
    "balance_of",
    CallData.compile({ account })
  );

  return {
    eth: ethResult?.balance?.low ?? BigInt(0),
    lords: lordsBalanceResult ?? BigInt(0),
  };
};