import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/EtoApi.interfaces";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { SUBMIT_ETO_PERMISSION } from "./../../config/constants";

export function* loadEtoData({ apiEtoService, notificationCenter }: TGlobalDependencies): any {
  try {
    const etoCompanyData: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyData();
    const etoData: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoData();

    yield put(
      actions.etoFlow.loadData({ etoData: etoData.body, companyData: etoCompanyData.body }),
    );
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* saveEtoData(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const currentCompanyData = yield effects.select((s: IAppState) => s.etoFlow.companyData);
    const currentEtoData = yield effects.select((s: IAppState) => s.etoFlow.etoData);

    let newCompanyData: IHttpResponse<TPartialCompanyEtoData> = currentCompanyData;
    let newEtoData: IHttpResponse<TPartialEtoSpecData> = currentEtoData;

    newCompanyData = yield apiEtoService.putCompanyData({
      ...currentCompanyData,
      ...action.payload.data.companyData,
    });
    if (currentEtoData.state === "preview")
      newEtoData = yield apiEtoService.putEtoData({
        ...currentEtoData,
        ...action.payload.data.etoData,
      });

    yield put(
      actions.etoFlow.loadData({
        etoData: newEtoData.body || newEtoData,
        companyData: newCompanyData.body || newCompanyData,
      }),
    );
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    yield put(actions.etoFlow.loadDataStart());
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  }
}

export function* submitEtoData(
  {
    apiEtoService,
    notificationCenter,
    logger,
    intlWrapper: { intl: { formatIntlMessage } },
  }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SUBMIT_DATA_START") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_ETO_PERMISSION],
      formatIntlMessage("eto.modal.submit-description"),
    );
    yield apiEtoService.submitCompanyAndEtoData();
    notificationCenter.info("ETO Successfully submitted");
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_DATA_START", loadEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
}
