import BigNumber from "bignumber.js";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import {NumericString, Overwrite} from "../../types";
import {
  EETOStateOnChain,
  IEtoTotalInvestmentState,
  TEtoStartOfStates,
  TStateEtoWithCompanyAndContract,
} from "./interfaces/interfaces";

export const convertToEtoTotalInvestment = (
  [totalEquivEurUlps, totalTokensInt, totalInvestors]: [BigNumber, BigNumber, BigNumber],
  euroTokenBalance: BigNumber,
  etherTokenBalance: BigNumber,
): IEtoTotalInvestmentState => ({
  totalEquivEurUlps: totalEquivEurUlps.toString() as NumericString,
  totalTokensInt: totalTokensInt.toString() as NumericString,
  totalInvestors: totalInvestors.toString()as NumericString,
  euroTokenBalance: euroTokenBalance.toString()as NumericString,
  etherTokenBalance: etherTokenBalance.toString() as NumericString,
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul(1000).toNumber());
};

export const convertToStateStartDate = (
  startOfStates: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [EETOStateOnChain.Setup]: startOfSetup,
    [EETOStateOnChain.Whitelist]: startOfWhitelist,
    [EETOStateOnChain.Public]: startOfPublic,
    [EETOStateOnChain.Signing]: startOfSigning,
    [EETOStateOnChain.Claim]: startOfClaim,
    [EETOStateOnChain.Payout]: startOfPayout,
    [EETOStateOnChain.Refund]: startOfRefund,
  };
};

export function isOnChain(
  eto: TStateEtoWithCompanyAndContract,
): eto is Overwrite<
  TStateEtoWithCompanyAndContract,
  { contract: Exclude<TStateEtoWithCompanyAndContract["contract"], undefined> }
> {
  return eto.state === EEtoState.ON_CHAIN && eto.contract !== undefined;
}
