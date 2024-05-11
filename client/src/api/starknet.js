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