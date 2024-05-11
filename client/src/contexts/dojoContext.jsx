import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { getEvents } from "@dojoengine/utils";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import React, { createContext, useState } from "react";
import { Account } from "starknet";
import AccountDialog from "../components/dialogs/account";
import OnboardingWizard from '../components/header/onboardingWizard';
import { translateEvent } from "../helpers/events";
import MANIFEST from '../manifest.json';

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const ENVIRONMENT = import.meta.env.VITE_NODE_ENV;
  const MASTER_ADDRESS = import.meta.env.VITE_PUBLIC_MASTER_ADDRESS;
  const MASTER_PRIVATE_KEY = import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY;
  const NODE_URL = import.meta.env.VITE_PUBLIC_NODE_URL;

  const { enqueueSnackbar } = useSnackbar()

  const dojoProvider = new _dojoProvider(MANIFEST, NODE_URL);
  const [devAccount] = useState(new Account(dojoProvider.provider, MASTER_ADDRESS, MASTER_PRIVATE_KEY, "1"))
  const { account } = useAccount()

  const executeTx = async (contract_name, system, call_data) => {
    if (ENVIRONMENT !== 'development' && !account) {
      showConnectWallet(true)
      return
    }

    let _account = ENVIRONMENT === 'development' ? devAccount : account;

    try {
      const tx = await dojoProvider.execute(_account, contract_name, system, call_data)

      const receipt = await _account.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar('Contract error', { variant: 'error', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } })
        return
      }

      const events = getEvents(receipt)

      const translatedEvents = events.map(event => translateEvent(event.data))

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