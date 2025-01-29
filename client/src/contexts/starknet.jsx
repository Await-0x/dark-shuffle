import { ControllerConnector } from "@cartridge/connector";
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
import { useCallback } from "react";

const StarknetChainId = {
  SN_MAIN: "0x534e5f4d41494e",
  SN_SEPOLIA: "0x534e5f5345504f4c4941",
}

const battle_systems = getContractByName(dojoConfig.manifest, dojoConfig.namespace, "battle_systems")?.address
const draft_systems = getContractByName(dojoConfig.manifest, dojoConfig.namespace, "draft_systems")?.address
const game_systems = getContractByName(dojoConfig.manifest, dojoConfig.namespace, "game_systems")?.address
const map_systems = getContractByName(dojoConfig.manifest, dojoConfig.namespace, "map_systems")?.address

const cartridge = new ControllerConnector({
  policies: [
    {
      target: game_systems,
      method: "mint",
    },
    {
      target: game_systems,
      method: "enter_season",
    },
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
  namespace: dojoConfig.namespace,
  slot: "darkshuffle-sepolia",
  preset: "dark-shuffle",
  rpc: dojoConfig.rpcUrl,
  colorMode: "dark",
  indexerUrl: dojoConfig.toriiRawUrl,
  tokens: {
    erc20: [dojoConfig.lordsAddress]
  },
  chains: [{ rpcUrl: dojoConfig.rpcUrl }],
  defaultChainId: StarknetChainId.SN_SEPOLIA,
})

export function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    recommended: [
      argent(),
      braavos(),
    ],
    includeRecommended: "onlyIfNoConnectors",
  });

  const rpc = useCallback(() => {
    return { nodeUrl: dojoConfig.rpcUrl };
  }, []);

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={jsonRpcProvider({ rpc })}
      connectors={[...connectors, cartridge]}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}