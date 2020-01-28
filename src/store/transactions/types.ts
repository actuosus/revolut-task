import { WalletId } from "../wallets/types";

export type TransactionId = string;
export enum TransactionType {
  TRANSFER = 10
}
export interface BaseTransaction {
  id: TransactionId;
  type: TransactionType;
  timestamp: number;
}

export interface TransferTransaction extends BaseTransaction {
  fromWalletId: WalletId;
  toWalletId: WalletId;
  amount: number;
  fromAmount: number;
}

export type Transaction = TransferTransaction;
export type TransactionsState = Record<TransactionId, Transaction>;

export type TransferAction = {
  type: "TRANSFER";
  payload: {
    fromWalletId: WalletId;
    toWalletId: WalletId;
    amount: number;
    rate: number;
    timestamp: number;
  };
};

export type TransactionActions = TransferAction;
