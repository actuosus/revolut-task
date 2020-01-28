import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import { composeWithDevTools } from "remote-redux-devtools";
import { ReduxState } from "../@types/ReduxState";
import ratesReducer from "../store/rates/reducer";
import { subscribeToRates, watchGetRates } from "../store/rates/sagas";
import transactionsReducer from "../store/transactions/reducer";
import walletReducer from "../store/wallets/reducer";
import storage from "./storage";
import { watchExchange } from "./transactions/sagas";

const rootReducer = combineReducers({
  wallets: walletReducer,
  rates: ratesReducer,
  transactions: transactionsReducer
});

const rootSaga = function*() {
  yield all([fork(watchGetRates), fork(subscribeToRates), fork(watchExchange)]);
};

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "revolut",
  storage
};

export default function configureStore(initialState: ReduxState) {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    composeWithDevTools({ realtime: true, port: 8000 });
  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);

  // persistor.purge();

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
}
