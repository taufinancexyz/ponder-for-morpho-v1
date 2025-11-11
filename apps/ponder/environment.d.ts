declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // These must be defined as strings, but will be validated in src/env.ts
      SELECTED_CHAIN_NAME?: string;
      SELECTED_CHAIN_ID?: string;
      SELECTED_CHAIN_RPC_URL?: string;
      MORPHO_ADDRESS?: string;
      MORPHO_START_BLOCK?: string;
      META_MORPHO_FACTORY_ADDRESS?: string;
      META_MORPHO_FACTORY_START_BLOCK?: string;
      ADAPTIVE_CURVE_IRM_ADDRESS?: string;
      ADAPTIVE_CURVE_IRM_START_BLOCK?: string;
    }
  }
}

export {};
