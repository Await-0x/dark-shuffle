import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { useBurner } from "@dojoengine/create-burner";
import { getEvents } from "@dojoengine/utils";
import { useSnackbar } from "notistack";
import React, { createContext, useState } from "react";
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);

  const { enqueueSnackbar } = useSnackbar()
  const [account, setAccount] = useState()

  const { create, list, get, select, isDeploying, clear } = useBurner();
  create();

  const executeTx = async (contract_name, system, call_data) => {
    if (!dojoConfig.development && !account) {
      showConnectWallet(true)
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

  return (
    <DojoContext.Provider
      value={{
        address: account?.address,
        executeTx,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};