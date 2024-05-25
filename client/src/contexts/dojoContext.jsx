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

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);
  const rpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.rpcUrl, }), []);

  const [account, setAccount] = useState();
  const [creatingBurner, setCreatingBurner] = useState();

  useEffect(() => {
    if (!dojoConfig.development) return;

    if (localStorage.getItem('burner')) {
      let burner = JSON.parse(localStorage.getItem('burner'))
      setAccount(new Account(rpcProvider, burner.address, burner.privateKey, "1"))
    } else {
      createBurner()
    }
  }, [])

  const executeTx = async (contract_name, system, call_data) => {
    if (!account) {
      // showConnectWallet(true)
      return
    }

    try {
      const tx = await dojoProvider.execute(account, contract_name, system, call_data)

      const receipt = await account.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      const events = getEvents(receipt)
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
        address: account?.address,
        executeTx,
        createBurner,
        creatingBurner
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};