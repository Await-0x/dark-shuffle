import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import React, { createContext, useEffect, useState } from "react";
import { Account } from "starknet";
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);
  const [devAccount] = useState(new Account(dojoProvider.provider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey, "1"))
  const { account } = useAccount()

  const [txQueue, setTxQueue] = useState([])
  const [txStatus, setTxStatus] = useState()

  useEffect(() => {
    if (txQueue.length > 0 && txStatus !== 'fail') {
      let tx = txQueue[0]
      executeTx(tx[0], tx[1], tx[2])
    }
  }, [txQueue])

  const addTxToQueue = (contract_name, system, call_data) => {
    setTxQueue(prev => [...prev, [contract_name, system, call_data]])
  }

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
        setTxQueue([])
        setTxStatus('fail')
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      setTxQueue(prev => prev.slice(1))

      const events = getEvents(receipt)
      console.log(events)
      const translatedEvents = events.map(event => translateEvent(event.data))
      console.log(translatedEvents)
      return translatedEvents
    } catch (ex) {
      console.log(ex)
      setTxQueue([])
      setTxStatus('fail')
      enqueueSnackbar(ex.issues ? ex.issues[0].message : 'Something went wrong', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
    }
  }

  return (
    <DojoContext.Provider
      value={{
        address: account?.address,
        executeTx,
        addTxToQueue,
        setTxStatus,
        txStatus
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};