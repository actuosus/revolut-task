/* eslint-disable @typescript-eslint/no-explicit-any */
import sagaHelper from "redux-saga-testing";
import { put } from "redux-saga/effects";
import sinon from "sinon";
import * as RatesService from "../../services/rates";
import { getRates, getRatesSuccess } from "./actions";
import { fetchRates } from "./sagas";

describe("rates store", () => {
  let getEcbRateStub: sinon.SinonStub;

  beforeEach(() => {
    getEcbRateStub = sinon.stub(RatesService, "getEcbRate").resolves({
      base: "EUR",
      rates: [
        { currency: "USD", rate: 1.2 },
        { currency: "GBP", rate: 0.89 }
      ]
    });
  });

  afterEach(() => {
    getEcbRateStub.restore();
  });

  // @ts-ignore
  const it = sagaHelper(fetchRates(getRates("EUR"), RatesService));

  it("should call api", (result: any) => {
    expect(result).toEqual(RatesService.getEcbRate());

    return {
      base: "EUR",
      rates: [
        { currency: "USD", rate: 1.2 },
        { currency: "GBP", rate: 0.89 }
      ]
    };
  });

  it("should be able to fetch rates", (value: any) => {
    expect(value).toMatchObject(
      put(
        getRatesSuccess({
          currency: "EUR",
          rates: {
            // Randomized values
            USD: expect.any(Number),
            GBP: expect.any(Number)
          }
        })
      )
    );
  });

  it("and then nothing", (result: any) => {
    expect(result).toBeUndefined();
  });
});
