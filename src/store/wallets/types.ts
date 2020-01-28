export type Currency =
  | "EUR"
  | "USD"
  | "JPY"
  | "BGN"
  | "CZK"
  | "DKK"
  | "GBP"
  | "HUF"
  | "PLN"
  | "RON"
  | "SEK"
  | "CHF"
  | "ISK"
  | "NOK"
  | "HRK"
  | "RUB"
  | "TRY"
  | "AUD"
  | "BRL"
  | "CAD"
  | "CNY"
  | "HKD"
  | "IDR"
  | "ILS"
  | "INR"
  | "KRW"
  | "MXN"
  | "MYR"
  | "NZD"
  | "PHP"
  | "SGD"
  | "THB"
  | "ZAR";
export type WalletId = string;
export interface Wallet {
  id: WalletId;
  currency: Currency;
  balance: number;
}

export type WalletsState = Record<WalletId, Wallet>;

export const EXCHANGE = "EXCHANGE";
export const EXCHANGE_REQUEST = "EXCHANGE_REQUEST";
export const EXCHANGE_SUCCESS = "EXCHANGE_SUCCESS";
export const EXCHANGE_FAILURE = "EXCHANGE_FAILURE";

export interface ExchangeAction {
  type: typeof EXCHANGE;
  payload: {
    fromWalletId: WalletId;
    toWalletId: WalletId;
    amount: number;
    rate: number;
    timestamp: number;
  };
}

export type WalletActions = ExchangeAction;
