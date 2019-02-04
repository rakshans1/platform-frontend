import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  getCurrentInvestmentProgressPercentage,
  getInvestmentCalculatedPercentage,
} from "../../../../../lib/api/eto/EtoUtils";
import { TEtoWithCompanyAndContract } from "../../../../../modules/public-etos/types";
import { normalize } from "../../../../../utils/Number.utils";
import {
  PercentageIndicatorBar,
  TProgressBarProps,
} from "../../../../shared/PercentageIndicatorBar";

import { TTranslatedString } from "../../../../../types";
import * as styles from "./InvestmentProgress.module.scss";

type TProps = {
  eto: TEtoWithCompanyAndContract;
};

type TLabelExternalProps = {
  label: TTranslatedString;
  width: number;
  textAnchor?: "start" | "end" | "middle";
};

const Label: React.FunctionComponent<TLabelExternalProps> = ({
  label,
  width,
  textAnchor = "middle",
}) => {
  return (
    <text x={`${width}%`} y={30} textAnchor={textAnchor} className={styles.label}>
      {label}
    </text>
  );
};

const InvestmentProgress: React.FunctionComponent<TProps> = ({ eto }) => {
  const calculatedPercentage = getInvestmentCalculatedPercentage(eto);
  const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);

  const getNormalizedValue = normalize({ min: 0, max: calculatedPercentage });

  const successOfEtoNormalized = getNormalizedValue(100);
  const currentProgressOfEtoNormalized = getNormalizedValue(currentProgressPercentage);

  const progress: TProgressBarProps[] = [
    { progress: Math.ceil(currentProgressOfEtoNormalized * 100), theme: "green" },
  ];

  if (currentProgressOfEtoNormalized > successOfEtoNormalized) {
    progress.push({ progress: successOfEtoNormalized * 100, radius: 0 });
  }

  return (
    <PercentageIndicatorBar
      className={styles.investmentProgress}
      layout="narrow"
      progress={progress}
      svgGroupStyle={{ transform: `translate(0 4)` }}
      svgHeight={40}
    >
      <rect x={`${successOfEtoNormalized * 100}%`} y={-6} className={cn(styles.successPoint)} />

      <Label
        label={<FormattedMessage id="shared-component.eto-overview.invest.min-amount" />}
        width={successOfEtoNormalized * 100}
      />

      <Label
        label={<FormattedMessage id="shared-component.eto-overview.invest.max-amount" />}
        width={100}
        textAnchor="end"
      />
    </PercentageIndicatorBar>
  );
};

export { InvestmentProgress };
