import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import React, { createContext, useState } from "react";
import { Account } from "starknet";
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);
  const [devAccount] = useState(new Account(dojoProvider.provider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey, "1"))
  const { account } = useAccount()

  const [txStatus, setTxStatus] = useState()

  const executeTx = async (contract_name, system, call_data) => {
    if (!account) {
      showConnectWallet(true)
      return
    }

    let _account = dojoConfig.development ? devAccount : account;

    try {
      const tx = await dojoProvider.execute(_account, contract_name, system, call_data)

      const receipt = await _account.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

      if (receipt.execution_status === "REVERTED") {
        setTxStatus('failed')
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      const events = getEvents(receipt)
      const translatedEvents = events.map(event => translateEvent(event.data))
      console.log(translatedEvents)
      return translatedEvents
    } catch (ex) {
      console.log(ex)
      setTxStatus('failed')
      enqueueSnackbar(ex.issues ? ex.issues[0].message : 'Something went wrong', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }
  }

  return (
    <DojoContext.Provider
      value={{
        address: account?.address,
        executeTx,
        txStatus
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};