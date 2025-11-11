import { defineChain } from "viem";

import { ENV } from "./env";

export const localDocker = defineChain({
  id: 1337,
  name: "LOCAL_DOCKER",
  network: "local-docker",
  nativeCurrency: {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [ENV.chain.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "https://google.com",
    },
  },
  contracts: {
    multicall3: {
      address: ENV.multicall3.address,
    },
  },
});
