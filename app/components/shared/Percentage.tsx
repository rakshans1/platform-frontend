import * as React from "react";
import BigNumber from "bignumber.js";

type IExternalProps = {
  children: BigNumber;
};

const Percentage: React.FunctionComponent<IExternalProps> = ({ children }) => (
  <>{`${children.mul(100).toString()}%`}</>
);

export { Percentage };
