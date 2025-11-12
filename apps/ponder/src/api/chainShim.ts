import { defineChain } from "viem";
import { localhost } from "viem/chains";

import { ENV } from "../env";

export const modifyLocalhostContracts = () => {
  const localDocker = defineChain({
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

  // Without this, Ponder throws
  // ChainDoesNotSupportContract: Chain "Localhost" does not support contract "multicall3".
  // when querying liquidatable positions API endpoint
  localhost.contracts = localDocker.contracts;
};
