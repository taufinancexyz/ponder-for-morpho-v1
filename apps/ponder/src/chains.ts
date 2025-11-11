import { chains } from "@/constants";
import { type PickFrom, type PonderContract, pick } from "@/types";

const tiers = {
  all: Object.keys(chains) as (keyof typeof chains)[],
};

type Tiers = typeof tiers;

export function getChainNames<K extends keyof Tiers>(tier: K): Tiers[K] {
  return tiers[tier];
}

export function getChains<K extends keyof Tiers>(tier: K): PickFrom<typeof chains, Tiers[K]> {
  return pick(chains, tiers[tier]);
}

export function getPartialContract<
  Contract extends PonderContract<keyof typeof chains>,
  K extends keyof Tiers,
>(
  contract: Contract,
  tier: K,
): Omit<Contract, "chain"> & { chain: PickFrom<Contract["chain"], Tiers[K]> } {
  return {
    ...contract,
    chain: pick(contract.chain, getChainNames(tier)),
  };
}
