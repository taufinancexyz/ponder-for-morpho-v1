import { createConfig, factory } from "ponder";
import { getAbiItem } from "viem/utils";

import { adaptiveCurveIrmAbi } from "./abis/AdaptiveCurveIrm";
import { metaMorphoAbi } from "./abis/MetaMorpho";
import { metaMorphoFactoryAbi } from "./abis/MetaMorphoFactory";
import { Chains, ENV } from "./src/env";

import { morphoBlueAbi } from "~/abis/MorphoBlue";

function configCreator({
  chain,
  contracts,
}: {
  chain: {
    name: Chains;
    chainId: number;
    rpcUrl: string;
  };
  contracts: {
    morpho: {
      address: `0x${string}`;
      startBlock: number;
    };
    metaMorphoFactory: {
      address: `0x${string}`;
      startBlock: number;
    };
    adaptiveCurveIrm: {
      address: `0x${string}`;
      startBlock: number;
    };
  };
}) {
  return createConfig({
    chains: {
      [chain.name]: {
        chainId: chain.chainId,
        rpcUrl: chain.rpcUrl,
      },
    },
    contracts: {
      Morpho: {
        abi: morphoBlueAbi,
        chain: chain.name,
        ...contracts.morpho,
      },
      MetaMorphoFactory: {
        abi: metaMorphoFactoryAbi,
        chain: chain.name,
        ...contracts.metaMorphoFactory,
      },
      // https://ponder.sh/docs/config/contracts#factory-pattern
      // Get the MetaMorpho address from the MetaMorphoFactory CreateMetaMorpho event
      MetaMorpho: {
        abi: metaMorphoAbi,
        chain: chain.name,
        address: factory({
          // MetaMorphoFactory address
          address: contracts.metaMorphoFactory.address,
          event: getAbiItem({
            abi: metaMorphoFactoryAbi,
            name: "CreateMetaMorpho",
          }),
          parameter: "metaMorpho",
        }),
      },
      AdaptiveCurveIRM: {
        abi: adaptiveCurveIrmAbi,
        chain: chain.name,
        ...contracts.adaptiveCurveIrm,
      },
    },
  });
}

export default configCreator({
  chain: ENV.chain,
  contracts: {
    morpho: ENV.morpho,
    metaMorphoFactory: ENV.metaMorphoFactory,
    adaptiveCurveIrm: ENV.adaptiveCurveIrm,
  },
});
