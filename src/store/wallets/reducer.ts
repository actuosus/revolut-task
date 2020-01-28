import { EXCHANGE, WalletActions, WalletsState } from "./types";

const initialState: WalletsState = {
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
};

const walletReducer = (state = initialState, action: WalletActions) => {
  switch (action.type) {
    case EXCHANGE: {
      const { fromWalletId, toWalletId, amount, rate } = action.payload;
      const fromWallet = { ...state[fromWalletId] };
      const toWallet = { ...state[toWalletId] };

      fromWallet.balance -= amount;
      toWallet.balance += amount * rate;

      return { ...state, [fromWalletId]: fromWallet, [toWalletId]: toWallet };
    }
  }
  return state;
};

export default walletReducer;
