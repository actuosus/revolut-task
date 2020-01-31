import {
  TransactionActions,
  TransactionsState,
  TransactionType
} from "./types";

const initialState: TransactionsState = {};

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
