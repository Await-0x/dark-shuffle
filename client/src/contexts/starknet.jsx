import CartridgeConnector from "@cartridge/connector";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  voyager
} from "@starknet-react/core";
import React from "react";

const cartridge = new CartridgeConnector()

export function StarknetProvider({ children }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc: () => ({ nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL }) })}
      connectors={[cartridge]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}