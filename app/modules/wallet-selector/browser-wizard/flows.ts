import { GetState } from "../../../di/setupBindings";
import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/Logger";
import {
  BrowserWalletAccountApprovalRejectedError,
  BrowserWalletConnector,
} from "../../../lib/web3/BrowserWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { mapBrowserWalletErrorToErrorMessage } from "./errors";
import {BrowserWalletErrorMessage} from "../../../components/translatedMessages/messages";

export const browserWizardFlows = {
  resetApprovalRequestBrowserWalletWizard: injectableFn(
    async (dispatch: AppDispatch) => {
      dispatch(actions.walletSelector.browserWalletResetApprovalRequest());
    },
    [symbols.appDispatch, symbols.browserWalletConnector],
  ),

  tryConnectingWithBrowserWallet: injectableFn(
    async (
      dispatch: AppDispatch,
      browserWalletConnector: BrowserWalletConnector,
      web3Manager: Web3Manager,
      logger: ILogger,
      getState: GetState,
    ) => {
      if (!getState().browserWalletWizardState.approvalRejected) {
        try {
          const browserWallet = await browserWalletConnector.connect(web3Manager.networkId);

          await web3Manager.plugPersonalWallet(browserWallet);
          dispatch(actions.walletSelector.connected());
        } catch (e) {
          if (e instanceof BrowserWalletAccountApprovalRejectedError) {
            dispatch(actions.walletSelector.browserWalletAccountApprovalRejectedError());
          } else {
            const error = mapBrowserWalletErrorToErrorMessage(e);
            dispatch(actions.walletSelector.browserWalletConnectionError(error));
            if (error.messageType === BrowserWalletErrorMessage.GENERIC_ERROR) {
              logger.error("Error while trying to connect with browser wallet", e);
            }
          }
        }
      }
    },
    [
      symbols.appDispatch,
      symbols.browserWalletConnector,
      symbols.web3Manager,
      symbols.logger,
      symbols.getState,
    ],
  ),
};
