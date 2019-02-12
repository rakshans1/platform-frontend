import {NumericString} from "../../../types";
import BigNumber from "bignumber.js";
import {numericStringToBigNumber} from "../../../utils/numericStringUtils";

export interface IStateWalletMigrationData {
  smartContractAddress: string;
  migrationInputData: string;
  gasLimit: NumericString;
  value: NumericString;
}

export interface IBlWalletMigrationData {
  smartContractAddress: string;
  migrationInputData: string;
  gasLimit: BigNumber;
  value: BigNumber;
}

export const stateToBlConversionSpec = {
  gasLimit: numericStringToBigNumber(),
  value: numericStringToBigNumber(),
};
