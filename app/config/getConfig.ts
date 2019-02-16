import { getRequiredEnv, verifyOptionalFlagEnv } from "./configUtils";

export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
  };
  contractsAddresses: {
    universeContractAddress: string;
  };
  bankTransferDetails: {
    recipient: string;
    iban: string;
    bic: string;
  };
}

export function getConfig(env: NodeJS.ProcessEnv): IConfig {
  verifyFeatureFlags(env);

  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(env, "NF_RPC_PROVIDER"),
    },
    contractsAddresses: {
      universeContractAddress: getRequiredEnv(env, "NF_UNIVERSE_CONTRACT_ADDRESS"),
    },
    bankTransferDetails: {
      recipient: getRequiredEnv(env, "NF_BANK_TRANSFER_RECIPIENT"),
      iban: getRequiredEnv(env, "NF_BANK_TRANSFER_IBAN"),
      bic: getRequiredEnv(env, "NF_BANK_TRANSFER_BIC"),
    },
  };
}

/**
 * We do not store feature flags inside the config. We just verify them here and they are accessed directly via process.env to allow easy build optimization.
 */
function verifyFeatureFlags(env: NodeJS.ProcessEnv): void {
  verifyOptionalFlagEnv(env, "NF_FEATURE_EMAIL_CHANGE_ENABLED");
}
