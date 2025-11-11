import { chains, isPonderChain } from "./constants";

export const ENV = (() => {
  const chain = process.env.SELECTED_CHAIN;
  const morphoAddress = process.env.MORPHO_ADDRESS;
  const morphoStartBlock = process.env.MORPHO_START_BLOCK;
  const metaMorphoFactoryAddress = process.env.META_MORPHO_FACTORY_ADDRESS;
  const metaMorphoFactoryStartBlock = process.env.META_MORPHO_FACTORY_START_BLOCK;
  const adaptiveCurveIrmAddress = process.env.ADAPTIVE_CURVE_IRM_ADDRESS;
  const adaptiveCurveIrmStartBlock = process.env.ADAPTIVE_CURVE_IRM_START_BLOCK;

  if (!isPonderChain(chain)) {
    throw new Error(
      `Invalid or missing SELECTED_CHAIN env var. Must be one of: ${Object.keys(chains).join(
        ", ",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      )}, but got: ${chain!}`,
    );
  }

  const contractNames = ["MORPHO", "META_MORPHO_FACTORY", "ADAPTIVE_CURVE_IRM"] as const;

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

  return {
    chain,
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
  };
})();
