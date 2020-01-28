import { Currency } from "../wallets/types";

export const GET_RATES = "GET_RATE";
export const GET_RATES_REQUEST = "GET_RATE_REQUEST";
export const GET_RATES_SUCCESS = "GET_RATE_SUCCESS";
export const GET_RATE_FAILURE = "GET_RATE_FAILURE";
export const SUBSCRIBE_TO_RATES = "SUBSCRIBE_TO_RATES";
export const UNSUBSCRIBE_FROM_RATES = "UNSUBSCRIBE_FROM_RATES";

export type Rate = Partial<Record<Currency, number>>;

export type RatesState = Partial<Record<Currency, Rate>> & {
  error?: string | null;
};

export interface RatesData {
  currency: Currency;
  rates: Partial<Record<Currency, number>>;
}

export interface GetRatesAction {
  type: typeof GET_RATES;
  payload: {
    currency: Currency;
    interval?: number;
  };
}

export interface GetRatesRequestAction {
  type: typeof GET_RATES_REQUEST;
}

export interface GetRatesSuccessAction {
  type: typeof GET_RATES_SUCCESS;
  payload: {
    currency: Currency;
    rates: Partial<Record<Currency, number>>;
  };
}

export interface GetRatesFailureAction {
  type: typeof GET_RATE_FAILURE;
  payload: Error;
}

export interface SubscribeToRatesAction {
  type: typeof SUBSCRIBE_TO_RATES;
  payload: {
    currency: Currency;
    interval?: number;
  };
}

export interface UnsubscribeFromRatesAction {
  type: typeof UNSUBSCRIBE_FROM_RATES;
  payload: {
    currency: Currency;
  };
}

export type RatesActions =
  | GetRatesAction
  | GetRatesRequestAction
  | GetRatesSuccessAction
  | GetRatesFailureAction
  | SubscribeToRatesAction
  | UnsubscribeFromRatesAction;
