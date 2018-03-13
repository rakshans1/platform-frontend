export const appRoutes = {
  wallet: "/wallet",
  root: "/",
  register: "/register",
  login: "/login",
  kyc: "/kyc",
  recover: "/recover",
  dashboard: "/dashboard",
  demo: "/demo",
};

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Home } from "./Home";
import { Kyc } from "./kyc/Kyc";
import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";
import { Wallet } from "./wallet/Wallet";
import { WalletRecoverMain } from "./walletSelector/walletRecover/WalletRecoverMain";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const AppRouter: React.SFC = () => (
  <Switch>
    <OnlyPublicRoute path={appRoutes.root} component={Home} exact />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recover} component={WalletRecoverMain} />

    <OnlyAuthorizedRoute path={appRoutes.wallet} component={Wallet} />
    <OnlyAuthorizedRoute path={appRoutes.kyc} component={Kyc} />
    <OnlyAuthorizedRoute path={appRoutes.dashboard} component={Dashboard} exact />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </Switch>
);

//TODO: move help into wallet selector
