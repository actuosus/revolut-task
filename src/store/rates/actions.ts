import { Currency } from "../wallets/types";
import {
  GetRatesAction,
  GetRatesFailureAction,
  GetRatesRequestAction,
  GetRatesSuccessAction,
  GET_RATES,
  GET_RATES_REQUEST,
  GET_RATES_SUCCESS,
  GET_RATE_FAILURE,
  RatesData,
  SubscribeToRatesAction,
  SUBSCRIBE_TO_RATES,
  UnsubscribeFromRatesAction,
  UNSUBSCRIBE_FROM_RATES
} from "./types";

export const getRates = (currency: Currency): GetRatesAction => {
  return {
    type: GET_RATES,
    payload: {
      currency
    }
  };
};

export const getRatesRequest = (): GetRatesRequestAction => {
  return {
    type: GET_RATES_REQUEST
  };
};

export const getRatesSuccess = (data: RatesData): GetRatesSuccessAction => {
  return {
    type: GET_RATES_SUCCESS,
    payload: data
  };
};

export const getRatesFailure = (e: Error): GetRatesFailureAction => {
  return {
    type: GET_RATE_FAILURE,
    payload: e
  };
};

export const subscribeToRates = (
  currency: Currency,
  interval?: number
): SubscribeToRatesAction => {
  return {
    type: SUBSCRIBE_TO_RATES,
    payload: {
      currency,
      interval
    }
  };
};

export const unsubscribeFromRates = (
  currency: Currency
): UnsubscribeFromRatesAction => {
  return {
    type: UNSUBSCRIBE_FROM_RATES,
    payload: {
      currency
    }
  };
};
