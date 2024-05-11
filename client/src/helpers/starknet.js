import { jsonRpcProvider } from "@starknet-react/core";
import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";
import { argent, braavos } from "@starknet-react/core";

export const argentWebWalletConnector = new WebWalletConnector({
  url: "https://web.argent.xyz/",
});

export const connectors = [argent(), braavos(), argentWebWalletConnector];

export function getProvider() {
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    return jsonRpcProvider({ rpc: () => ({ nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL }) });
  }

  return jsonRpcProvider({ rpc: () => ({ nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL }) });
}