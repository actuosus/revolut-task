import {
  TransactionActions,
  TransactionsState,
  TransactionType
} from "./types";

const initialState: TransactionsState = {
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
};

export const transactionReducer = (
  state = initialState,
  action: TransactionActions
) => {
  switch (action.type) {
    case "TRANSFER": {
      const lastTransactionId = Object.keys(state)
        .sort((a, b) => {
          if (parseInt(a) > parseInt(b)) {
            return 1;
          } else {
            return -1;
          }
        })
        .pop();
      const lastTransactionIdNumber = parseInt(lastTransactionId || "1");
      const newId = (lastTransactionIdNumber + 1).toString();

      return {
        ...state,
        [newId]: {
          id: newId,
          type: TransactionType.TRANSFER,
          fromWalletId: action.payload.fromWalletId,
          toWalletId: action.payload.toWalletId,
          amount: action.payload.amount * action.payload.rate,
          fromAmount: action.payload.amount,
          timestamp: action.payload.timestamp
        }
      };
    }

    default:
      return state;
  }
};

export default transactionReducer;
