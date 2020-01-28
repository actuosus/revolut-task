import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import sinon from "sinon";
// import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { ReduxState } from "../../@types/ReduxState";
import * as RatesService from "../../services/rates";
import configureStore from "../../store";
import { getRates } from "../../store/rates/actions";
import { exchange } from "../../store/wallets/actions";
import { ConnectedExchange, Exchange } from "./Exchange";

jest.mock("navigation");

describe("<Exchange />", () => {
  const initialState: ReduxState = {
    wallets: {
      "1": { id: "1", currency: "USD", balance: 10 },
      "2": { id: "2", currency: "GBP", balance: 12 }
    },
    rates: {
      GBP: {
        GBP: 1,
        USD: 0.8
      },
      USD: {
        GBP: 1.25,
        USD: 1
      }
    },
    transactions: {}
  };

  // Actual Redux Store to check balance change below
  const { store } = configureStore(initialState);
  let getEcbRateStub: sinon.SinonStub, wrapper: ShallowWrapper, navigation;

  beforeEach(() => {
    getEcbRateStub = sinon.stub(RatesService, "getEcbRate").resolves({
      base: "EUR",
      rates: [
        { currency: "USD", rate: 1.2 },
        { currency: "GBP", rate: 0.89 }
      ]
    });

    navigation = require("navigation");

    wrapper = shallow(
      // @ts-ignore shallow wrapper with store
      <ConnectedExchange store={store} navigation={navigation} />
    );
  });

  afterEach(() => {
    getEcbRateStub.restore();
  });

  it("matches its snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("+++ render the connected(SMART) component", () => {
    expect(wrapper.length).toEqual(1);
  });

  it("has wallets", () => {
    expect(wrapper.find(Exchange).prop("wallets")).toEqual(
      initialState.wallets
    );
  });

  it("has rates", () => {
    expect(wrapper.find(Exchange).prop("rates")).toEqual(initialState.rates);
  });

  it("should be able to get rates", () => {
    store.dispatch(getRates("GBP"));
    const state = store.getState();
    expect(state.rates).toStrictEqual(initialState.rates);
  });

  it("should be able to exchange", () => {
    store.dispatch(exchange("1", "2", 5, 1.1, Date.now()));
    const state = store.getState();
    expect(state.wallets).toStrictEqual({
      "1": { id: "1", currency: "USD", balance: 5 },
      "2": { id: "2", currency: "GBP", balance: 17.5 }
    });
  });
});
