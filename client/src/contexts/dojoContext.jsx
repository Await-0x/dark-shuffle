import { Account, constants, ec, json, stark, Provider, hash, CallData } from 'starknet';
import { DojoProvider as _dojoProvider } from "@dojoengine/core";
import { useBurner } from "@dojoengine/create-burner";
import { getEvents } from "@dojoengine/utils";
import { useSnackbar } from "notistack";
import React, { createContext, useState } from "react";
import { dojoConfig } from "../../dojo.config";
import { translateEvent } from "../helpers/events";
import { Account, RpcProvider } from "starknet";

export const DojoContext = createContext()

export const DojoProvider = ({ children, showConnectWallet }) => {
  const dojoProvider = new _dojoProvider(dojoConfig.manifest, dojoConfig.rpcUrl);

  const { enqueueSnackbar } = useSnackbar()
  const [account, setAccount] = useState()

  const createBurner = async () => {
    const privateKey = stark.randomAddress();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);
    const constructorCallData = CallData.compile({ publicKey: publicKey });
    const contractAddress = hash.calculateContractAddressFromHash(
      publicKey,
      dojoConfig.accountClassHash,
      constructorCallData,
      0
    );

    const account = new Account(dojoProvider, contractAddress, privateKey, "1");
    await account.deployAccount({
      classHash: dojoConfig.accountClassHash,
      constructorCalldata: constructorCallData,
      addressSalt: publicKey,
    })

    await dojoProvider.waitForTransaction(transaction_hash);
    console.log('✅ New OpenZeppelin account created.\n   address =', contractAddress);
  }

  createBurner()

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