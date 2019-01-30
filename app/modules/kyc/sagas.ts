import { delay } from "redux-saga";
import { cancel, fork, put, select, take } from "redux-saga/effects";

import { KycFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { SUBMIT_KYC_PERMISSION } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EKycRequestType,
  ERequestOutsourcedStatus,
  ERequestStatus,
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
} from "../../lib/api/KycApi.interfaces";
import { IUser } from "../../lib/api/users/interfaces";
import { IdentityRegistry } from "../../lib/contracts/IdentityRegistry";
import { IAppAction, IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/jwt/sagas";
import { selectUser } from "../auth/selectors";
import { displayErrorModalSaga } from "../generic-modal/sagas";
import { EInitType } from "../init/reducer";
import { selectIsSmartContractInitDone } from "../init/selectors";
import { neuCall, neuTakeEvery, neuTakeOnly } from "../sagasUtils";
import {
  selectCombinedBeneficialOwnerOwnership,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectKycRequestType,
} from "./selectors";
import { deserializeClaims } from "./utils";

function* loadClientData(): any {
  yield put(actions.kyc.kycLoadIndividualData());
  yield put(actions.kyc.kycLoadBusinessData());
}

/**
 * whole watcher feature is just a temporary workaround for a lack of real time communication with backend
 */
let kycWidgetWatchDelay: number = 1000;
function* kycRefreshWidgetSaga({ logger }: TGlobalDependencies): any {
  kycWidgetWatchDelay = 1000;
  while (true) {
    const requestType: EKycRequestType = yield select((s: IAppState) =>
      selectKycRequestType(s.kyc),
    );
    const status: ERequestStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestStatus(s),
    );

    if (
      status === ERequestStatus.ACCEPTED ||
      status === ERequestStatus.REJECTED ||
      status === ERequestStatus.IGNORED
    ) {
      return;
    }

    const outsourcedStatus: ERequestOutsourcedStatus | undefined = yield select((s: IAppState) =>
      selectKycRequestOutsourcedStatus(s.kyc),
    );

    if (
      status === ERequestStatus.PENDING ||
      (status === ERequestStatus.OUTSOURCED &&
        outsourcedStatus &&
        (outsourcedStatus === ERequestOutsourcedStatus.STARTED ||
          outsourcedStatus === ERequestOutsourcedStatus.CANCELED ||
          outsourcedStatus === ERequestOutsourcedStatus.ABORTED ||
          outsourcedStatus === ERequestOutsourcedStatus.REVIEW_PENDING))
    ) {
      requestType === EKycRequestType.INDIVIDUAL
        ? yield put(actions.kyc.kycLoadIndividualRequest(true))
        : yield put(actions.kyc.kycLoadBusinessRequest(true));
      logger.info("KYC refreshed", status, requestType);
    }

    yield delay(kycWidgetWatchDelay);
    expandWatchTimeout();
  }
}

// it will sleep for 1000, 3000, and then always 10 000
function expandWatchTimeout(): void {
  // tslint:disable-next-line
  if (kycWidgetWatchDelay === 1000) {
    kycWidgetWatchDelay = 3000;
  } else {
    kycWidgetWatchDelay = 10000;
  }
}

let watchTask: any;
function* kycRefreshWidgetSagaWatcher(): any {
  while (true) {
    yield take("KYC_WATCHER_START");
    watchTask = yield fork(neuCall, kycRefreshWidgetSaga);
  }
}

function* kycRefreshWidgetSagaWatcherStop(): any {
  while (true) {
    yield take("KYC_WATCHER_STOP");
    yield cancel(watchTask);
  }
}

/**
 * Individual Request
 */
function* loadIdentityClaim({ contractsService }: TGlobalDependencies): Iterator<any> {
  const identityRegistry: IdentityRegistry = contractsService.identityRegistry;

  const loggedInUser: IUser = yield select<IAppState>(state => selectUser(state.auth));

  const claims: string = yield identityRegistry.getClaims(loggedInUser.userId);

  yield put(actions.kyc.kycSetClaims(deserializeClaims(claims)));
}

/**
 * Individual Request
 */
function* loadIndividualData(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualData(true));
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.getIndividualData();
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualData(false));
  }
}

function* submitIndividualData(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_FORM") return;
  try {
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.putIndividualData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
    yield put(actions.routing.goToKYCIndividualDocumentVerification());
  } catch {
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* uploadIndividualFile(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_INDIVIDUAL_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateIndividualDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadIndividualDocument(file);
    yield put(actions.kyc.kycUpdateIndividualDocument(false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocument(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));
  }
}

function* loadIndividualFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getIndividualDocuments();
    yield put(actions.kyc.kycUpdateIndividualDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocuments(false));
  }
}

function* loadIndividualRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_REQUEST_STATE") return;
  try {
    if (!action.payload.inBackground) {
      yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    }
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, undefined, e.message));
  }
}

function* submitIndividualRequest(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_REQUEST") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );
    yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
    yield put(
      actions.genericModal.showGenericModal(
        createMessage(KycFlowMessage.KYC_VERIFICATION_TITLE),
        createMessage(KycFlowMessage.KYC_VERIFICATION_DESCRIPTION),
        undefined,
        createMessage(KycFlowMessage.KYC_SETTINGS_BUTTON),
        actions.routing.goToProfile(),
      ),
    );
  } catch {
    yield put(actions.kyc.kycUpdateIndividualRequestState(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED));
  }
}

function* startIndividualInstantId({
  apiKycService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.startInstantId();
    if (result.body.redirectUrl) window.location.replace(result.body.redirectUrl);
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch (e) {
    logger.warn("KYC instant id failed to start", e);
    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)); //module.kyc.sagas.problem.submitting
  }
}

function* cancelIndividualInstantId({
  apiKycService,
  notificationCenter,
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield apiKycService.cancelInstantId();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, { status: ERequestStatus.DRAFT }));
  } catch (e) {
    logger.warn("KYC instant id failed to stop", e);
    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)); //module.kyc.sagas.problem.submitting
  }
}

/**
 * Company Request
 */

// legal representative
function* loadLegalRepresentative(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<
      IKycLegalRepresentative
    > = yield apiKycService.getLegalRepresentative();
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
  }
}

function* submitLegalRepresentative(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_LEGAL_REPRESENTATIVE") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<
      IKycLegalRepresentative
    > = yield apiKycService.putLegalRepresentative(action.payload.data);
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* uploadLegalRepresentativeFile(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(true));
    const result: IHttpResponse<
      IKycFileInfo
    > = yield apiKycService.uploadLegalRepresentativeDocument(file);
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));
  }
}

function* loadLegalRepresentativeFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(true));
    const result: IHttpResponse<
      IKycFileInfo[]
    > = yield apiKycService.getLegalRepresentativeDocuments();
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false));
  }
}

// business data
function* setBusinessType(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SET_BUSINESS_TYPE") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    let institutionData: IKycBusinessData = {};
    try {
      const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
      institutionData = result.body;
    } catch (_e) {}
    institutionData = { ...institutionData, legalFormType: action.payload.type };
    yield apiKycService.putBusinessData(institutionData);
    yield put(actions.kyc.kycUpdateBusinessData(false, institutionData));
    yield put(actions.routing.goToKYCBusinessData());
  } catch (_e) {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

// legal representative
function* loadBusinessData({ apiKycService }: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
  }
}

function* submitBusinessData(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.putBusinessData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* uploadBusinessFile(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BUSINESS_FILE") return;
  const { file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBusinessDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBusinessDocument(file);
    yield put(actions.kyc.kycUpdateBusinessDocument(false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocument(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));
  }
}

function* loadBusinessFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_FILE_LIST") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBusinessDocuments();
    yield put(actions.kyc.kycUpdateBusinessDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocuments(false));
  }
}

// beneficial owners
function* loadBeneficialOwners(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNERS") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwners(true));
    const result: IHttpResponse<IKycBeneficialOwner[]> = yield apiKycService.getBeneficialOwners();
    yield put(actions.kyc.kycUpdateBeneficialOwners(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwners(false));
  }
}

function* createBeneficialOwner(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_ADD_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.postBeneficialOwner({});
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* submitBeneficialOwner(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.putBeneficialOwner(
      action.payload.owner,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SAVING_DATA));
  }
}

function* deleteBeneficalOwner(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_DELETE_BENEFICIAL_OWNER") return;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    yield apiKycService.deleteBeneficialOwner(action.payload.id);
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, action.payload.id, undefined));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA));
  }
}

function* uploadBeneficialOwnerFile(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BENEFICIAL_OWNER_FILE") return;
  const { boid, file } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBeneficialOwnerDocument(
      boid,
      file,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false, result.body));
    notificationCenter.info(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED));
  }
}

function* loadBeneficialOwnerFiles(
  { apiKycService }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST") return;
  const { boid } = action.payload;
  try {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBeneficialOwnerDocuments(
      boid,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false));
  }
}

// request
function* loadBusinessRequest(
  { apiKycService, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_REQUEST_STATE") return;
  try {
    if (!action.payload.inBackground) {
      yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    }
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.getBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch (e) {
    logger.error("Error while getting business KYC data", e);
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, undefined, e.message));
  }
}

function* submitBusinessRequest(
  { apiKycService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_REQUEST") return;
  try {
    // check whether combined value of beneficial owners percentages is less or equal 100%
    const ownerShip = yield select((s: IAppState) => selectCombinedBeneficialOwnerOwnership(s.kyc));
    if (ownerShip > 100) {
      yield neuCall(
        displayErrorModalSaga,
        createMessage(KycFlowMessage.KYC_ERROR),
        createMessage(KycFlowMessage.KYC_BENEFICIAL_OWNERS),
      );
      return;
    }

    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );

    yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    const result: IHttpResponse<IKycRequestState> = yield apiKycService.submitBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
    yield put(
      actions.genericModal.showGenericModal(
        createMessage(KycFlowMessage.KYC_VERIFICATION_TITLE),
        createMessage(KycFlowMessage.KYC_VERIFICATION_DESCRIPTION),
        undefined,
        createMessage(KycFlowMessage.KYC_SETTINGS_BUTTON),
        actions.routing.goToProfile(),
      ),
    );
  } catch {
    yield put(actions.kyc.kycUpdateBusinessRequestState(false));
    notificationCenter.error(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED));
  }
}

export function* loadKycRequestData(): any {
  // Wait for contracts to init
  const isSmartContractsInitialized = yield select(selectIsSmartContractInitDone);
  if (!isSmartContractsInitialized) {
    yield neuTakeOnly("INIT_DONE", { initType: EInitType.START_CONTRACTS_INIT });
  }

  yield put(actions.kyc.kycLoadIndividualRequest());
  yield put(actions.kyc.kycLoadBusinessRequest());

  yield put(actions.kyc.kycLoadClaims());

  // we block init until all requests are done. This avoids flickering of various elements in the app.
  yield loadForOneOfTheKYCRequestsToLoad();
  yield loadForOneOfTheKYCRequestsToLoad();
}

function* loadForOneOfTheKYCRequestsToLoad(): any {
  yield take([
    (action: IAppAction) =>
      action.type === "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE" &&
      !action.payload.individualRequestStateLoading,

    (action: IAppAction) =>
      action.type === "KYC_UPDATE_BUSINESS_REQUEST_STATE" &&
      !action.payload.businessRequestStateLoading,
  ]);
}

export function* kycSagas(): any {
  yield fork(neuTakeEvery, "KYC_LOAD_CLIENT_DATA", loadClientData);

  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_DATA", loadIndividualData);
  yield fork(neuTakeEvery, "KYC_SUBMIT_INDIVIDUAL_FORM", submitIndividualData);
  yield fork(neuTakeEvery, "KYC_UPLOAD_INDIVIDUAL_FILE", uploadIndividualFile);
  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_FILE_LIST", loadIndividualFiles);
  // Outsourced
  yield fork(neuTakeEvery, "KYC_START_INSTANT_ID", startIndividualInstantId);
  yield fork(neuTakeEvery, "KYC_CANCEL_INSTANT_ID", cancelIndividualInstantId);
  yield fork(neuTakeEvery, "KYC_LOAD_INDIVIDUAL_REQUEST_STATE", loadIndividualRequest);
  yield fork(neuTakeEvery, "KYC_SUBMIT_INDIVIDUAL_REQUEST", submitIndividualRequest);

  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE", loadLegalRepresentative);
  yield fork(neuTakeEvery, "KYC_SUBMIT_LEGAL_REPRESENTATIVE", submitLegalRepresentative);
  yield fork(neuTakeEvery, "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE", uploadLegalRepresentativeFile);
  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", loadLegalRepresentativeFiles);

  yield fork(neuTakeEvery, "KYC_SET_BUSINESS_TYPE", setBusinessType);
  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_DATA", loadBusinessData);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BUSINESS_DATA", submitBusinessData);
  yield fork(neuTakeEvery, "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", loadLegalRepresentativeFiles);
  yield fork(neuTakeEvery, "KYC_UPLOAD_BUSINESS_FILE", uploadBusinessFile);
  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_FILE_LIST", loadBusinessFiles);

  yield fork(neuTakeEvery, "KYC_LOAD_BENEFICIAL_OWNERS", loadBeneficialOwners);
  yield fork(neuTakeEvery, "KYC_ADD_BENEFICIAL_OWNER", createBeneficialOwner);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BENEFICIAL_OWNER", submitBeneficialOwner);
  yield fork(neuTakeEvery, "KYC_DELETE_BENEFICIAL_OWNER", deleteBeneficalOwner);
  yield fork(neuTakeEvery, "KYC_UPLOAD_BENEFICIAL_OWNER_FILE", uploadBeneficialOwnerFile);
  yield fork(neuTakeEvery, "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST", loadBeneficialOwnerFiles);

  yield fork(neuTakeEvery, "KYC_LOAD_BUSINESS_REQUEST_STATE", loadBusinessRequest);
  yield fork(neuTakeEvery, "KYC_SUBMIT_BUSINESS_REQUEST", submitBusinessRequest);

  yield fork(neuTakeEvery, "KYC_LOAD_CLAIMS", loadIdentityClaim);

  yield fork(kycRefreshWidgetSagaWatcher);
  yield fork(kycRefreshWidgetSagaWatcherStop);
}
