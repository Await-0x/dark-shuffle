import { CallData } from "starknet";

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