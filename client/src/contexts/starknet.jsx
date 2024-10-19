import CartridgeConnector from "@cartridge/connector";
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
import { getContractByName } from "@dojoengine/core";

const battle_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "battle_systems")?.address
const draft_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "draft_systems")?.address
const game_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "game_systems")?.address
const node_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "node_systems")?.address
const season_systems = getContractByName(dojoConfig.manifest, "darkshuffle", "season_systems")?.address

const cartridge = new CartridgeConnector({
  policies: [
    {
      target: battle_systems,
      method: "summon_creature",
    },
    {
      target: battle_systems,
      method: "cast_spell",
    },
    {
      target: battle_systems,
      method: "discard",
    },
    {
      target: battle_systems,
      method: "end_turn",
    },
    {
      target: draft_systems,
      method: "get_draft_options",
    },
    {
      target: draft_systems,
      method: "pick_card",
    },
    {
      target: game_systems,
      method: "start_game",
    },
    {
      target: game_systems,
      method: "verify_game",
    },
    {
      target: node_systems,
      method: "generate_tree",
    },
    {
      target: node_systems,
      method: "select_node",
    },
    {
      target: node_systems,
      method: "skip_node",
    }
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