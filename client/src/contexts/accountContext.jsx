import { BurnerProvider } from "@dojoengine/create-burner";
import { useAccount } from "@starknet-react/core";
import React, { createContext, useMemo } from "react";
import { Account, RpcProvider } from "starknet";
import { dojoConfig } from "../../dojo.config";

export const AccountContext = createContext()

export const AccountProvider = ({ children }) => {
  const rpcProvider = useMemo(() => new RpcProvider({ nodeUrl: dojoConfig.rpcUrl, }), []);

  const { account } = useAccount()
  const devAccount = useMemo(
    () => new Account(rpcProvider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey, "1"),
    [rpcProvider, dojoConfig.masterAddress, dojoConfig.masterPrivateKey]
  )

  let masterAccount = dojoConfig.development ? devAccount : account;

  return (
    <BurnerProvider initOptions={{
      masterAccount,
      rpcProvider,
      accountClassHash: dojoConfig.accountClassHash,
      feeTokenAddress: dojoConfig.feeTokenAddress
    }}>
      <AccountContext.Provider
        value={{
          masterAccount
        }}
      >
        {children}
      </AccountContext.Provider>
    </BurnerProvider>
  );
};