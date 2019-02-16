import * as React from "react";

import { getInvestmentAmount } from "../../../lib/api/eto/EtoUtils";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../shared/Money";
import { ToHumanReadableForm } from "../../shared/ToHumanReadableForm";

type TExternalProps = {
  etoData: TBlEtoWithCompanyAndContract;
};

const InvestmentAmount: React.FunctionComponent<TExternalProps> = ({ etoData }) => {
  const { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount(etoData);

  const value = (
    <ToHumanReadableForm number={minInvestmentAmount}>
      {divider => <ToHumanReadableForm number={maxInvestmentAmount} divider={divider} />}
    </ToHumanReadableForm>
  );

  return (
    <Money
      format={EMoneyFormat.FLOAT}
      currencySymbol={ECurrencySymbol.SYMBOL}
      currency={ECurrency.EUR}
      value={value}
    />
  );
};

export { InvestmentAmount };
