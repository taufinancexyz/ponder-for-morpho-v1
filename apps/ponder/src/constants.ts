import { factory, loadBalance, type ContractConfig } from "ponder";
import { fallback, getAbiItem, http, type Transport } from "viem";
import { riseTestnet } from "viem/chains";

import { type PonderContract, typedFromEntries } from "@/types";
import { adaptiveCurveIrmAbi } from "~/abis/AdaptiveCurveIrm";
import { metaMorphoAbi } from "~/abis/MetaMorpho";
import { metaMorphoFactoryAbi } from "~/abis/MetaMorphoFactory";
import { morphoBlueAbi } from "~/abis/MorphoBlue";
import { preLiquidationFactoryAbi } from "~/abis/PreLiquidationFactory";

function parseRpcString(str: string): Transport {
  if (str.startsWith("fallback")) {
    return fallback(
      str
        .slice("fallback".length + 1, -1)
        .split(",")
        .map(parseRpcString),
    );
  }
  if (str.startsWith("loadbalance")) {
    return loadBalance(
      str
        .slice("loadbalance".length + 1, -1)
        .split(",")
        .map(parseRpcString),
    );
  }
  return http(str);
}

function asPonderChain<chainId extends number>(chainId: chainId): { id: chainId; rpc: Transport } {
  const rpcString = process.env[`PONDER_RPC_URL_${chainId.toFixed(0)}`];

  if (!rpcString) {
    throw new Error(`Missing PONDER_RPC_URL_${chainId.toFixed(0)} env var`);
  }

  return {
    id: chainId,
    rpc: parseRpcString(rpcString),
  };
}

export const chains = {
  riseTestnet: asPonderChain(riseTestnet.id),
  localDocker: asPonderChain(1337),
} as const;

export const Morpho = {
  abi: morphoBlueAbi,
  chain: {
    riseTestnet: {
      address: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
      startBlock: 0,
    },
    localDocker: {
      address: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
      startBlock: 0,
    },
  },
} as const satisfies PonderContract<keyof typeof chains>;

export const MetaMorphoFactory = {
  abi: metaMorphoFactoryAbi,
  chain: {
    riseTestnet: {
      address: "0xd2c9068aD68c4c9F1A4fE1Ea650BdFE13DC5EaF1",
      startBlock: 14812082,
    },
    localDocker: {
      address: "0xD2c9068aD68c4c9F1A4fE1Ea650BdFE13DC5EaF1",
      startBlock: 0,
    },
  },
} as const satisfies PonderContract<keyof typeof chains>;

export const MetaMorpho = {
  abi: metaMorphoAbi,
  chain: typedFromEntries(
    Object.entries(MetaMorphoFactory.chain).map(([key, values]) => [
      key as keyof typeof MetaMorphoFactory.chain,
      {
        address: factory({
          address: values.address,
          event: getAbiItem({
            abi: MetaMorphoFactory.abi,
            name: "CreateMetaMorpho",
          }),
          parameter: "metaMorpho",
        }),
        startBlock: values.startBlock,
      } satisfies Exclude<ContractConfig["chain"], string>[string],
    ]),
  ),
} satisfies PonderContract<keyof typeof chains>;

export const AdaptiveCurveIRM = {
  abi: adaptiveCurveIrmAbi,
  chain: {
    riseTestnet: {
      address: "0xBADb1809ecF658F36e31CcC980F72de029e1cE46",
      startBlock: 14640172,
    },
    localDocker: {
      address: "0xBADb1809ecF658F36e31CcC980F72de029e1cE46",
      startBlock: 0,
    },
  },
} as const satisfies PonderContract<keyof typeof chains>;

export const PreLiquidationFactory = {
  abi: preLiquidationFactoryAbi,
  chain: {
    riseTestnet: {
      address: "0x09d7629E82DdD80890495672201fe5FE1f909B0b",
      startBlock: 14812316,
    },
    localDocker: {
      address: "0x09d7629E82DdD80890495672201fe5FE1f909B0b",
      startBlock: 0,
    },
  },
} as const satisfies PonderContract<keyof typeof chains>;
