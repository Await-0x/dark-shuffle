import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  useInjectedConnectors,
  voyager
} from "@starknet-react/core";
import React from "react";
import { dojoConfig } from "../../dojo.config";
import { VRF_PROVIDER_ADDRESS } from "../helpers/constants";

const battle_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "battle_systems")?.address
const draft_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "draft_systems")?.address
const game_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "game_systems")?.address
const map_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "map_systems")?.address

const cartridge = new CartridgeConnector({
  policies: [
    {
      target: game_systems,
      method: "start_game",
    },
    {
      target: draft_systems,
      method: "pick_card",
    },
    {
      target: map_systems,
      method: "generate_tree",
    },
    {
      target: map_systems,
      method: "select_node",
    },
    {
      target: battle_systems,
      method: "battle_actions",
    },
    {
      target: VRF_PROVIDER_ADDRESS,
      method: "request_random",
      description: "Allows requesting random numbers from the VRF provider",
    },
    {
      target: dojoConfig.lordsAddress,
      method: "approve",
    },
  ],
  rpc: dojoConfig.rpcUrl,
  theme: "darkshuffle",
})

export function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    recommended: [
      argent(),
      braavos(),
    ],
    includeRecommended: "onlyIfNoConnectors",
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc: () => ({ nodeUrl: dojoConfig.rpcUrl }) })}
      connectors={[...connectors, cartridge]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}