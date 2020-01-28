import { EXCHANGE, ExchangeAction, WalletId } from "./types";

export const exchange = (
  fromWalletId: WalletId,
  toWalletId: WalletId,
  amount: number,
  rate: number,
  timestamp: number
): ExchangeAction => {
  return {
    type: EXCHANGE,
    payload: {
      fromWalletId,
      toWalletId,
      amount,
      rate,
      timestamp
    }
  };
};
