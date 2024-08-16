import { argent, braavos, jsonRpcProvider } from "@starknet-react/core";

import CartridgeConnector from "@cartridge/connector";
import { dojoConfig } from "../../dojo.config";

const cartridgeConnector = (gameAddress, lordsAddress, ethAddress) =>
  new CartridgeConnector(
    [
      {
        target: gameAddress,
        method: "new_game",
      },
      {
        target: gameAddress,
        method: "explore",
      },
      {
        target: gameAddress,
        method: "attack",
      },
      {
        target: gameAddress,
        method: "flee",
      },
      {
        target: gameAddress,
        method: "equip",
      },
      {
        target: gameAddress,
        method: "drop",
      },
      {
        target: gameAddress,
        method: "upgrade",
      },
      {
        target: lordsAddress,
        method: "approve",
      },
      {
        target: lordsAddress,
        method: "mint_lords",
      },
      {
        target: ethAddress,
        method: "approve",
      },
    ],
  );

export const connectors = () => [
  cartridgeConnector(dojoConfig.gameAddress, dojoConfig.lordsAddress, dojoConfig.ethAddress),
  argent(),
  braavos()
];

export function getProvider() {
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    return jsonRpcProvider({ rpc: () => ({ nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL }) });
  }

  return jsonRpcProvider({ rpc: () => ({ nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL }) });
}