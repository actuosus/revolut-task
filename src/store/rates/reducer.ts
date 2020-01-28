import {
  GET_RATES_SUCCESS,
  GET_RATE_FAILURE,
  RatesActions,
  RatesState
} from "./types";

const initialState: RatesState = {
  error: null
};

const permuteRates = (base: string, rates: Partial<Record<string, number>>) => {
  const data = { [base]: { ...rates, [base]: 1 } };
  Object.keys(rates).forEach(_ => {
    const rate = rates[_] || 0;
    const ratio = 1 / rate;
    data[_] = { [base]: ratio };
    Object.keys(rates).forEach(item => {
      const rate = rates[item] || 0;
      data[_][item] = rate * ratio;
    });
  });

  return data;
};

export const ratesReducer = (state = initialState, action: RatesActions) => {
  switch (action.type) {
    case GET_RATES_SUCCESS:
      return {
        ...state,
        ...permuteRates(action.payload.currency, action.payload.rates),
        error: null
      };
    case GET_RATE_FAILURE:
      return { ...state, error: action.payload.message };
  }

  return state;
};

export default ratesReducer;
