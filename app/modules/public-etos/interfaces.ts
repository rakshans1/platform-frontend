import BigNumber from "bignumber.js";

import {DeepReadonly, NumericString} from "../../types";
import {IApiPublicEtoData, IStatePublicEtoData} from "../eto-flow/interfaces/PublicEtoData";
import {IApiCompanyEtoData, IStateCompanyEtoData} from "../eto-flow/interfaces/CompanyEtoData";

export type TApiPublicEtoData =
  IApiPublicEtoData & { company: IApiCompanyEtoData };


export interface IStatePublicEto {
  publicEtos: { [previewCode: string]: IStatePublicEtoData | undefined };
  companies: { [companyId: string]: IStateCompanyEtoData | undefined };
  contracts: { [previewCode: string]: IEtoContractDataState };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: IStateEtoTokenData | undefined };
}

export interface IEtoContractDataState {
  timedState: EETOStateOnChain;
  totalInvestment: IEtoTotalInvestmentState;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export interface IStateEtoTokenData {
  balance: NumericString;
  tokensPerShare: NumericString;
  totalCompanyShares: NumericString;
  companyValuationEurUlps: NumericString;
  tokenPrice: NumericString;
}

export interface ICalcEtoTokenData {
  balance: BigNumber;
  tokensPerShare: BigNumber;
  totalCompanyShares: BigNumber;
  companyValuationEurUlps: BigNumber;
  tokenPrice: BigNumber;
}

export interface IEtoTotalInvestmentState {
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

export type TStateEtoWithCompanyAndContract = DeepReadonly<
  IStatePublicEtoData & {
    // contract is undefined when ETO is not on blockchain
    contract?: IEtoContractDataState;
    company: IStateCompanyEtoData;
  }
>;
