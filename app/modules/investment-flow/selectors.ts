import { IAppState } from "../../store";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { selectIsAccountFrozen, selectIsClaimsVerified } from "../kyc/selectors";
import { EValidationState } from "../tx/sender/reducer";
import { selectTxValidationState } from "../tx/sender/selectors";
import { EInvestmentCurrency, EInvestmentType } from "./reducer";

// State Selectors

export const selectInvestmentEthValueUlps = (state: IAppState) => state.investmentFlow.ethValueUlps;

export const selectInvestmentEurValueUlps = (state: IAppState) =>
  state.investmentFlow.euroValueUlps;

export const selectInvestmentErrorState = (state: IAppState) => state.investmentFlow.errorState;

export const selectInvestmentType = (state: IAppState) => state.investmentFlow.investmentType;

export const selectInvestmentEtoId = (state: IAppState) => state.investmentFlow.etoId;

export const selectIsInvestmentInputValidated = (state: IAppState) =>
  state.investmentFlow.isValidatedInput;

export const selectInvestmentActiveTypes = (state: IAppState) =>
  state.investmentFlow.activeInvestmentTypes;

// Derived Values

export const selectIsICBMInvestment = (state: IAppState) => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.ICBMEth || type === EInvestmentType.ICBMnEuro;
};

export const selectIsReadyToInvest = (state: IAppState) => {
  const ethValue = selectInvestmentEthValueUlps(state);

  return !!(
    ethValue &&
    !selectInvestmentErrorState(state) &&
    selectIsInvestmentInputValidated(state) &&
    compareBigNumbers(ethValue, 0) > 0 &&
    selectTxValidationState(state) === EValidationState.VALIDATION_OK
  );
};

export const selectCurrencyByInvestmentType = (state: IAppState) => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.InvestmentWallet || type === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;
};

export const selectIsAllowedToInvest = (state: IAppState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);
