import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useSnackbar } from "notistack";
import React, { createContext, useMemo } from "react";
import { RpcProvider, Account } from 'starknet';
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";
import { useEffect } from "react";
import { createBurnerAccount } from "../api/starknet";
import { useState } from "react";
import { useAccount, useConnect, useNetwork } from "@starknet-react/core";

export const DojoContext = createContext()

export const DojoProvider = ({ children }) => {
  const { connect, connectors } = useConnect();
  let cartridgeConnector = connectors.find(conn => conn.id === 'cartridge')

  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);
  const rpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.rpcUrl, }), []);

  const { account, address, isConnecting } = useAccount()
  const { chain } = useNetwork()
  const [burner, setBurner] = useState();

  const [creatingBurner, setCreatingBurner] = useState();

  useEffect(() => {
    if (dojoConfig.chain !== 'katana') {
      return
    }

    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))

      if (burner.version === dojoConfig.version) {
        setBurner(new Account(rpcProvider, burner.address, burner.privateKey, "1"))
      } else {
        createBurner()
      }
    } else {
      createBurner()
    }
  }, [])

  const executeTx = async (contractName, entrypoint, calldata) => {
    let signer = dojoConfig.chain === 'katana' ? burner : account

    if (!signer) {
      dojoConfig.chain === 'katana' ? createBurner() : connect({ connector: cartridgeConnector })
      return
    }

    try {
      const tx = await dojoProvider.execute(signer,
        {
          contractName,
          entrypoint,
          calldata
        },
        'darkshuffle',
        dojoConfig.environment === 'katana' ? { maxFee: 0 } : {}
      );

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

    let account = await createBurnerAccount(rpcProvider)
    if (account) {
      setAccount(account)
    } else {
      enqueueSnackbar('Failed to create burner', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }

    setCreatingBurner(false)
  }

  return (
    <DojoContext.Provider
      value={{
        address: address ?? burner?.address,
        connecting: creatingBurner || isConnecting,
        network: chain.network,
        executeTx,
        createBurner,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};