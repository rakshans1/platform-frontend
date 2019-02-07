import {EUserType} from "../../lib/api/users/interfaces";
import {EWalletSubType, EWalletType} from "../web3/types";

export interface IAuthState {
  user?: IUserState;
  jwt?: string;
  currentAgreementHash?: string;
}

export interface IUserState {
  userId: string;
  backupCodesVerified?: boolean;
  latestAcceptedTosIpfs?: string;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}
