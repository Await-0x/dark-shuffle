import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useAccount, useConnect, useContract, useNetwork } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { Account, RpcProvider } from 'starknet';
import { dojoConfig } from "../../dojo.config";
import EthBalanceFragment from "../abi/EthBalanceFragment.json";
import Lords from "../abi/Lords.json";
import { createBurnerAccount, fetchBalances } from "../api/starknet";
import { translateEvent } from "../helpers/events";

export const DojoContext = createContext()

export const DojoProvider = ({ children }) => {
  const { contract: lordsContract } = useContract({ address: dojoConfig.lordsAddress, abi: Lords });
  const { contract: ethContract } = useContract({ address: dojoConfig.ethAddress, abi: EthBalanceFragment });

  const { chain } = useNetwork()
  const { account, address, isConnecting } = useAccount()
  const { connect, connectors } = useConnect();
  const { enqueueSnackbar } = useSnackbar()

  const [balances, setBalances] = useState({ eth: BigInt(0), lords: BigInt(0) })
  const [burner, setBurner] = useState();
  const [creatingBurner, setCreatingBurner] = useState();

  const dojoprovider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);

  const demoRpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.demoRpcUrl, }), []);
  const demoDojoProvider = new _dojoProvider(dojoConfig.devManifest, dojoConfig.demoRpcUrl);

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

  useEffect(() => {
    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))

      if (burner.version === dojoConfig.version) {
        setBurner(new Account(demoRpcProvider, burner.address, burner.privateKey, "1"))
      } else {
        createBurner()
      }
    } else {
      createBurner()
    }
  }, [])

  const executeTx = async (txs, isDemo) => {
    let signer = isDemo ? burner : account
    let provider = isDemo ? demoDojoProvider : dojoprovider

    if (!signer) {
      isDemo ? createBurner() : connect({ connector: cartridgeConnector })
      return
    }

    try {
      const tx = await provider.execute(signer, txs, 'darkshuffle', { maxFee: 10000000000000000, version: "1" });

      const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      const events = getEvents(receipt)
      console.log(events)
      const translatedEvents = events.map(event => translateEvent(event.data))
      console.log(translatedEvents)
      return translatedEvents
    } catch (ex) {
      console.log(ex)
      enqueueSnackbar(ex.issues ? ex.issues[0].message : 'Something went wrong', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }
  }

  const createBurner = async () => {
    setCreatingBurner(true)

    let account = await createBurnerAccount(demoRpcProvider)
    if (account) {
      setBurner(account)
    } else {
      enqueueSnackbar('Failed to create burner', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }

    setCreatingBurner(false)
  }

  return (
    <DojoContext.Provider
      value={{
        address: address,
        connecting: isConnecting,
        network: chain.network,
        balances,
        executeTx,
        createBurner,
        getBalances,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};