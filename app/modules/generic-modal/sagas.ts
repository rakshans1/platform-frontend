import { put, take } from "redux-saga/effects";

import { TMessage } from "../../components/translatedMessages/utils";
import { actions } from "../actions";

export function* displayInfoModalSaga(title: TMessage, description?: TMessage): any {
  yield put(actions.genericModal.showInfoModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}

export function* displayErrorModalSaga(title: TMessage, description?: TMessage): any {
  yield put(actions.genericModal.showErrorModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}
