import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useAccount, useConnect, useContract, useNetwork } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { RpcProvider } from 'starknet';
import { dojoConfig } from "../../dojo.config";
import EthBalanceFragment from "../abi/EthBalanceFragment.json";
import Lords from "../abi/Lords.json";
import { fetchBalances } from "../api/starknet";
import { translateEvent } from "../helpers/events";
import { Account } from "starknet";
import { translateName } from "../helpers/components";

export const DojoContext = createContext()

export const DojoProvider = ({ children }) => {
  const { contract: lordsContract } = useContract({ address: dojoConfig.lordsAddress, abi: Lords });
  const { contract: ethContract } = useContract({ address: dojoConfig.ethAddress, abi: EthBalanceFragment });

  const { chain } = useNetwork()
  const { account, address, isConnecting } = useAccount()
  const { connect, connectors } = useConnect();
  const { enqueueSnackbar } = useSnackbar()

  const [balances, setBalances] = useState({ eth: BigInt(0), lords: BigInt(0) })

  const dojoprovider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);

  const demoRpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.demoRpcUrl, }), []);
  const demoDojoProvider = new _dojoProvider(dojoConfig.manifest_dev, dojoConfig.demoRpcUrl);
  const demoAccount = new Account(demoRpcProvider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey);

  let cartridgeConnector = connectors.find(conn => conn.id === "controller")

  const getBalances = async () => {
    let balanceData = await fetchBalances(address ?? "0x0", ethContract, lordsContract)

    setBalances(balanceData)
  }

  useEffect(() => {
    if (account) {
      getBalances();
    }
  }, [account]);

  const executeTx = async (txs, isDemo) => {
    let signer = isDemo ? demoAccount : account
    let provider = isDemo ? demoDojoProvider : dojoprovider

    if (!signer) {
      connect({ connector: cartridgeConnector })
      return
    }

    try {
      const tx = await provider.execute(signer, txs, 'darkshuffle', { maxFee: 1000000000000000, version: "1" });

      const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      console.log('receipt', receipt)
      const translatedEvents = receipt.events.map(event => translateEvent(event))
      console.log('translatedEvents', translatedEvents)
      return translatedEvents
    } catch (ex) {
      console.log(ex)
      enqueueSnackbar(ex.issues ? ex.issues[0].message : 'Something went wrong', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }
  }

  return (
    <DojoContext.Provider
      value={{
        address: address,
        connecting: isConnecting,
        network: chain.network,
        balances,
        executeTx,
        getBalances,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};