import BigNumber from "bignumber.js";

import {EBankTransferFlowState, EInvestmentErrorState, EInvestmentType} from "./reducer";

export interface IInvestmentFlowData {
  etoId: string;
  euroValueUlps: BigNumber;
  ethValueUlps: BigNumber;
  investmentType?: EInvestmentType;
  activeInvestmentTypes: EInvestmentType[];
  errorState?: EInvestmentErrorState;
  isValidatedInput: boolean;
  bankTransferFlowState?: EBankTransferFlowState;
  bankTransferGasStipend?: boolean;
  bankTransferReference: string;
}
