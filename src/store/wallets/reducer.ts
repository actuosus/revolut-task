import { EXCHANGE, WalletActions, WalletsState } from "./types";

const initialState: WalletsState = {};

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
