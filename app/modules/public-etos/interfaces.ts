import {TPublicEtoDataState, TCompanyEtoDataState} from '../eto-flow/interfaces'
import {DeepReadonly, NumericString} from "../../types";

export interface IPublicEtoState {
  publicEtos: { [previewCode: string]: TPublicEtoDataState | undefined };
  companies: { [companyId: string]: TCompanyEtoDataState | undefined };
  contracts: { [previewCode: string]: IEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: IEtoTokenStateData | undefined };
}

export interface IEtoContractData {
  timedState: EETOStateOnChain;
  totalInvestment: IEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export interface IEtoTokenStateData {
  balance: NumericString;
  tokensPerShare: NumericString;
  totalCompanyShares: NumericString;
  companyValuationEurUlps: NumericString;
  tokenPrice: NumericString;
}

export interface IEtoTokenData {
  balance: NumericString;
  tokensPerShare: NumericString;
  totalCompanyShares: NumericString;
  companyValuationEurUlps: NumericString;
  tokenPrice: NumericString;
}

export interface IEtoTotalInvestment {
  totalEquivEurUlps: NumericString;
  totalTokensInt: NumericString;
  totalInvestors: NumericString;
  euroTokenBalance: NumericString;
  etherTokenBalance: NumericString;
}

export type TEtoStartOfStates = Record<EETOStateOnChain, Date | undefined>;

// Order is important. Next state is calculated by adding 1 to current state.
export enum EETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export type TEtoWithCompanyAndContract = DeepReadonly<
  TPublicEtoDataState & {
    // contract is undefined when ETO is not on blockchain
    contract?: IEtoContractData;
    company: TCompanyEtoDataState;
  }
>;
