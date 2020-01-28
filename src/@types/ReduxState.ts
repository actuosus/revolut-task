import { WalletsState } from '../store/wallets/types';
import { RatesState } from '../store/rates/types';
import { TransactionsState } from '../store/transactions/types';

interface State {
  wallets: WalletsState;
  rates: RatesState;
  transactions: TransactionsState;
}

export type ReduxState = State
