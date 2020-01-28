import { ReduxState } from "../@types/ReduxState";
import { TransactionType } from "./transactions/types";

const initialState: ReduxState = {
  rates: {
    error: null
  },
  wallets: {
    "1": {
      id: "1",
      currency: "GBP",
      balance: 58.33
    },
    "2": {
      id: "2",
      currency: "EUR",
      balance: 116.12
    },
    "3": {
      id: "3",
      currency: "USD",
      balance: 25.51
    },
    "4": {
      id: "4",
      currency: "RUB",
      balance: 250.99
    },
    "5": {
      id: "5",
      currency: "JPY",
      balance: 12
    }
  },
  transactions: {
    "1": {
      id: "1",
      type: TransactionType.TRANSFER,
      fromWalletId: "2",
      toWalletId: "1",
      amount: 50,
      fromAmount: 37.18,
      timestamp: 1452261660000 // 8 Jan 2016
    },
    "2": {
      id: "2",
      type: TransactionType.TRANSFER,
      fromWalletId: "1",
      toWalletId: "2",
      amount: 1.34,
      fromAmount: 1,
      timestamp: 1452261000000 // 8 Jan 2016
    },
    "3": {
      id: "3",
      type: TransactionType.TRANSFER,
      fromWalletId: "2",
      toWalletId: "1",
      amount: 7.45,
      fromAmount: 5,
      timestamp: 1452081600000 // 6 Jan 2016
    },
    "4": {
      id: "4",
      type: TransactionType.TRANSFER,
      fromWalletId: "2",
      toWalletId: "1",
      amount: 7.45,
      fromAmount: 5,
      timestamp: 1450459620000 // 18 Dec 2015
    },
    "5": {
      id: "5",
      type: TransactionType.TRANSFER,
      fromWalletId: "1",
      toWalletId: "3",
      amount: 7.45,
      fromAmount: 5,
      timestamp: 1450353600000 // 17 Dec 2015
    }
  }
};

export default initialState;
