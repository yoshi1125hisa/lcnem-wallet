import { Action } from '@ngrx/store';
import { Address, Transaction } from 'nem-library';
import { HistoryActions, HistoryActionTypes } from './history.actions';

export interface State {
  loading: boolean
  error?: Error
  transactions: Transaction[],
  lastAddress?: Address
}

export const initialState: State = {
  loading: false,
  transactions: []
};

export function reducer(state = initialState, action: HistoryActions): State {
  switch (action.type) {
    case HistoryActionTypes.LoadHistories: {
      return {
        ...state,
        loading: true,
        lastAddress: action.payload.address
      }
    }
    case HistoryActionTypes.LoadHistoriesSuccess: {
      return {
        ...state,
        loading: false,
        transactions: action.payload.transactions
      }
    }
    case HistoryActionTypes.LoadHistoriesError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    default: {
      return state;
    }
  }
}
