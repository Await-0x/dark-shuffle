import React from "react";

import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  voyager
} from "@starknet-react/core";
import { connectors, getProvider } from "../helpers/starknet";

export function StarknetProvider({ children }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={getProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}