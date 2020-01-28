import { cancel, delay, fork, put, take, takeEvery } from "redux-saga/effects";
import * as RatesService from "../../services/rates";
import { Currency } from "../wallets/types";
import { getRates, getRatesFailure, getRatesSuccess } from "./actions";
import {
  GetRatesAction,
  GET_RATES,
  SubscribeToRatesAction,
  SUBSCRIBE_TO_RATES,
  UNSUBSCRIBE_FROM_RATES
} from "./types";

const RANDOMIZE_RATE = true;

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function* fetchRates(_action: GetRatesAction, service = RatesService) {
  try {
    const response: RatesService.RatesResponse = yield service.getEcbRate();
    const rates = {} as Record<Currency, number>;
    response.rates.forEach(
      _ =>
        (rates[_.currency] =
          _.rate * (RANDOMIZE_RATE ? randomInRange(0.99, 1.001) : 1))
    );
    yield put(getRatesSuccess({ currency: response.base, rates }));

    // const openExchangeResponse = yield rateService.getOpenExchangeRate()
    // yield put(getRateSuccess({ currency: openExchangeResponse.base, rates: openExchangeResponse.rates }))
  } catch (e) {
    console.log(e);
    yield put(getRatesFailure(e));
  }
}

export function* watchGetRates() {
  yield takeEvery(GET_RATES, fetchRates);
}

export function* fetchRatesPeriodically(action: SubscribeToRatesAction) {
  while (true) {
    yield put(getRates(action.payload.currency));
    yield delay(action.payload.interval || 3000);
  }
}

export function* subscribeToRates() {
  let action;
  while ((action = yield take(SUBSCRIBE_TO_RATES))) {
    const task = yield fork(fetchRatesPeriodically, action);
    yield take(UNSUBSCRIBE_FROM_RATES);
    yield cancel(task);
  }
}

export function* unsubscribeFromRates() {
  yield takeEvery(UNSUBSCRIBE_FROM_RATES, yield put({ type: "STOP" }));
}
