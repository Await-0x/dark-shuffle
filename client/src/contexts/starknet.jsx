import CartridgeConnector from "@cartridge/connector";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  voyager
} from "@starknet-react/core";
import React from "react";
import { dojoConfig } from "../../dojo.config";

const cartridge = new CartridgeConnector()

export function StarknetProvider({ children }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc: () => ({ nodeUrl: dojoConfig.rpcUrl }) })}
      connectors={[cartridge]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}