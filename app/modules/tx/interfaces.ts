import {TPendingTxs} from "../../lib/api/users/interfaces";
import {NumericString} from "../../types";

export interface IStateWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: NumericString;
}
export interface IInvestmentDraftType {
  type: ETxSenderType.INVEST;
}

export type IDraftType = IStateWithdrawDraftType | IInvestmentDraftType;

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
  ETO_SET_DATE = "ETO_SET_DATE",
  USER_CLAIM = "USER_CLAIM",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}

export interface ITxMonitorState {
  txs: TPendingTxs;
}
