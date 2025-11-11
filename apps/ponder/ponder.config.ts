import { createConfig, factory } from "ponder";
import { getAbiItem } from "viem/utils";

import { adaptiveCurveIrmAbi } from "./abis/AdaptiveCurveIrm";
import { metaMorphoAbi } from "./abis/MetaMorpho";
import { metaMorphoFactoryAbi } from "./abis/MetaMorphoFactory";
import { ENV } from "./src/env";

import { chains } from "@/constants";
import { morphoBlueAbi } from "~/abis/MorphoBlue";

function configCreator({
  chain,
  contracts,
}: {
  chain: keyof typeof chains;
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
      [chain]: chains[chain],
    },
    contracts: {
      Morpho: {
        abi: morphoBlueAbi,
        chain,
        ...contracts.morpho,
      },
      MetaMorphoFactory: {
        abi: metaMorphoFactoryAbi,
        chain,
        ...contracts.metaMorphoFactory,
      },
      // https://ponder.sh/docs/config/contracts#factory-pattern
      // Get the MetaMorpho address from the MetaMorphoFactory CreateMetaMorpho event
      MetaMorpho: {
        abi: metaMorphoAbi,
        chain,
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
        chain,
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
