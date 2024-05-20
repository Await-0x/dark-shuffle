import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useSnackbar } from "notistack";
import React, { createContext, useMemo } from "react";
import { RpcProvider, Account } from 'starknet';
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);
  const rpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.rpcUrl, }), []);

  const masterAccount = useMemo(
    () => new Account(rpcProvider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey, "1"),
    [rpcProvider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey]
  )

  const executeTx = async (contract_name, system, call_data) => {
    if (!dojoConfig.development && !masterAccount) {
      showConnectWallet(true)
      return
    }

    try {
      const tx = await dojoProvider.execute(masterAccount, contract_name, system, call_data)

      const receipt = await masterAccount.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

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

  return (
    <DojoContext.Provider
      value={{
        address: masterAccount?.address,
        executeTx,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};