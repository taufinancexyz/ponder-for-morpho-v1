import { createConfig, factory } from "ponder";
import { getAbiItem } from "viem/utils";

import { adaptiveCurveIrmAbi } from "./abis/AdaptiveCurveIrm";
import { metaMorphoAbi } from "./abis/MetaMorpho";
import { metaMorphoFactoryAbi } from "./abis/MetaMorphoFactory";

import {
  AdaptiveCurveIRM,
  chains,
  MetaMorpho,
  MetaMorphoFactory,
  PreLiquidationFactory,
} from "@/constants";
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

export default createConfig({
  chains,
  contracts: {
    Morpho: {
      abi: morphoBlueAbi,
      chain: "riseTestnet",
      address: "0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63",
      startBlock: 12439123,
    },
    MetaMorphoFactory,
    MetaMorpho,
    AdaptiveCurveIRM,
    PreLiquidationFactory,
  },
});
