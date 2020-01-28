import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import configureStore from "redux-mock-store";
import { TransactionType } from "../../store/transactions/types";
import ConnectedAccount, { Account } from "./Account";

jest.mock("navigation");

describe("<Account />", () => {
  const initialState = {
    wallets: {
      1: { id: 1, currency: "USD", balance: 10 },
      2: { id: 2, currency: "GBP", balance: 12 }
    },
    transactions: {
      1: {
        type: TransactionType.TRANSFER,
        id: 1,
        fromWalletId: 1,
        toWalletId: 2,
        amount: 10,
        fromAmount: 2
      }
    }
  };
  const mockStore = configureStore();
  let store, wrapper: ShallowWrapper, component: ShallowWrapper, navigation;

  beforeEach(() => {
    store = mockStore(initialState);
    navigation = require("navigation");
    wrapper = shallow(
      // @ts-ignore shallow wrapper with store
      <ConnectedAccount store={store} navigation={navigation} />
    );
    component = wrapper.find(Account);
  });

  it("matches its snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("has wallets", () => {
    expect(component.prop("wallets")).toEqual(initialState.wallets);
  });

  it("has transactions", () => {
    expect(component.prop("transactions")).toEqual(initialState.transactions);
  });
});
