import { delay, put, takeEvery } from "redux-saga/effects";
import { EXCHANGE, ExchangeAction } from "../wallets/types";

function* recordTransferTransaction(action: ExchangeAction) {
  yield delay(1000);
  yield put({ type: "TRANSFER", payload: action.payload });
}

export function* watchExchange() {
  yield takeEvery(EXCHANGE, recordTransferTransaction);
}
