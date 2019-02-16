import { effects } from "redux-saga";
import { getContext } from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { authSagas } from "./auth/sagas";
import { bankTransferFlowSaga } from "./bank-transfer-flow/sagas";
import { bookBuildingFlowSagas } from "./bookbuilding-flow/sagas";
import { etoDocumentsSagas } from "./eto-documents/sagas";
import { etoFlowSagas } from "./eto-flow/sagas";
import { gasApiSagas } from "./gas/sagas";
import { icbmWalletGetDataSagas } from "./icbm-wallet-balance-modal/sagas";
import { immutableFileSagas } from "./immutable-file/sagas";
import { initSagas } from "./init/sagas";
import { investmentFlowSagas } from "./investment-flow/sagas";
import { investorTicketsSagas } from "./investor-portfolio/sagas";
import { kycSagas } from "./kyc/sagas";
import { profileSagas } from "./profile/sagas";
import { etoSagas } from "./public-etos/sagas";
import { routingSagas } from "./routing/sagas";
import { formSingleFileUploadSagas } from "./shared/formSingleFileUpload/sagas";
import { remoteFileSagas } from "./shared/remoteFile/sagas";
import { tokenPriceSagas } from "./shared/tokenPrice/sagas";
import { termsOfServiceSagas } from "./terms-of-service-modal/sagas";
import { txMonitorSagas } from "./tx/monitor/sagas";
import { txTransactionsSagasWatcher } from "./tx/transactions/sagas";
import { txValidatorSagasWatcher } from "./tx/validator/sagas";
import { browserWalletSagas } from "./wallet-selector/browser-wizard/sagas";
import { ledgerSagas } from "./wallet-selector/ledger-wizard/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { walletSagas } from "./wallet/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(bankTransferFlowSaga),
    effects.fork(termsOfServiceSagas),
    effects.fork(kycSagas),
    effects.fork(investorTicketsSagas),
    effects.fork(initSagas),
    effects.fork(profileSagas),
    effects.fork(web3Sagas),
    effects.fork(authSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(lightWalletSagas),
    effects.fork(browserWalletSagas),
    effects.fork(ledgerSagas),
    effects.fork(walletSagas),
    effects.fork(icbmWalletGetDataSagas),
    effects.fork(etoFlowSagas),
    effects.fork(immutableFileSagas),
    effects.fork(etoSagas),
    effects.fork(bookBuildingFlowSagas),
    effects.fork(formSingleFileUploadSagas),
    effects.fork(remoteFileSagas),
    effects.fork(txValidatorSagasWatcher),
    effects.fork(txTransactionsSagasWatcher),
    effects.fork(gasApiSagas),
    effects.fork(etoDocumentsSagas),
    effects.fork(txMonitorSagas),
    effects.fork(tokenPriceSagas),
    effects.fork(investmentFlowSagas),
    effects.fork(routingSagas),
  ]);
}

function* handleRootError(error: Error): Iterator<effects.Effect> {
  const { logger }: TGlobalDependencies = yield getContext("deps");

  logger.error(error);
}

export function* rootSaga(): Iterator<effects.Effect> {
  while (true) {
    try {
      yield effects.call(allSagas);
    } catch (e) {
      yield effects.call(handleRootError, e);
    }
  }
}
