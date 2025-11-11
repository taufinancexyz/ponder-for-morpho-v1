export const chains = ["RISE_TESTNET", "LOCAL_DOCKER"] as const;
export type Chains = (typeof chains)[number];

export function isPonderChain(chain: unknown): chain is (typeof chains)[number] {
  return (
    typeof chain === "string" &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chains.includes(chain)
  );
}

export const ENV = (() => {
  const selectedChainName = process.env.SELECTED_CHAIN_NAME;
  const selectedChainId = process.env.SELECTED_CHAIN_ID;
  const selectedChainRpcUrl = process.env.SELECTED_CHAIN_RPC_URL;

  const morphoAddress = process.env.MORPHO_ADDRESS;
  const morphoStartBlock = process.env.MORPHO_START_BLOCK;
  const metaMorphoFactoryAddress = process.env.META_MORPHO_FACTORY_ADDRESS;
  const metaMorphoFactoryStartBlock = process.env.META_MORPHO_FACTORY_START_BLOCK;
  const adaptiveCurveIrmAddress = process.env.ADAPTIVE_CURVE_IRM_ADDRESS;
  const adaptiveCurveIrmStartBlock = process.env.ADAPTIVE_CURVE_IRM_START_BLOCK;
  const multicall3Address = process.env.MULTICALL3_ADDRESS;

  if (!isPonderChain(selectedChainName)) {
    throw new Error(
      `Invalid or missing SELECTED_CHAIN env var. Must be one of: ${Object.keys(chains).join(
        ", ",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      )}, but got: ${selectedChainName!}`,
    );
  }

  const contractNames = [
    "MORPHO",
    "META_MORPHO_FACTORY",
    "ADAPTIVE_CURVE_IRM",
    "MULTICALL3",
  ] as const;

  [morphoAddress, metaMorphoFactoryAddress, adaptiveCurveIrmAddress].forEach((address, index) => {
    if (!address) {
      const varName = (contractNames[index] as string) + "_ADDRESS";
      throw new Error(`${varName} env var is not set`);
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      const varName = (contractNames[index] as string) + "_ADDRESS";
      throw new Error(`${varName} env var is not a valid Ethereum address`);
    }
  });

  // Check if positive integer
  [morphoStartBlock, metaMorphoFactoryStartBlock, adaptiveCurveIrmStartBlock].forEach(
    (block, index) => {
      if (!block) {
        const varName = (contractNames[index] as string) + "_START_BLOCK";
        throw new Error(`${varName} env var is not set`);
      }

      const blockNumber = Number(block);
      if (!Number.isInteger(blockNumber) || blockNumber < 0) {
        const varName = (contractNames[index] as string) + "_START_BLOCK";
        throw new Error(`${varName} env var must be a positive integer`);
      }
    },
  );

  // check chain id
  if (!selectedChainId) {
    throw new Error(`SELECTED_CHAIN_ID env var is not set`);
  }

  const selectedChainIdNumber = Number(selectedChainId);
  if (!Number.isInteger(selectedChainIdNumber) || selectedChainIdNumber <= 0) {
    throw new Error(`SELECTED_CHAIN_ID env var must be a positive integer`);
  }

  if (!selectedChainRpcUrl) {
    throw new Error(`SELECTED_CHAIN_RPC_URL env var is not set`);
  }

  // Check URL
  try {
    new URL(selectedChainRpcUrl);
  } catch {
    throw new Error(`SELECTED_CHAIN_RPC_URL env var is not a valid URL`);
  }

  return {
    chain: {
      name: selectedChainName,
      chainId: selectedChainIdNumber,
      rpcUrl: selectedChainRpcUrl,
      pollingInterval: 10_000,
    },
    morpho: {
      address: morphoAddress as `0x${string}`,
      startBlock: Number(morphoStartBlock),
    },
    metaMorphoFactory: {
      address: metaMorphoFactoryAddress as `0x${string}`,
      startBlock: Number(metaMorphoFactoryStartBlock),
    },
    adaptiveCurveIrm: {
      address: adaptiveCurveIrmAddress as `0x${string}`,
      startBlock: Number(adaptiveCurveIrmStartBlock),
    },
    multicall3: {
      address: multicall3Address as `0x${string}`,
    },
  };
})();
