import { Action } from '@ngrx/store';
import { Address, Transaction } from 'nem-library';
import { HistoryActions, HistoryActionTypes } from './history.actions';

export interface State {
  loading: boolean;
  error?: Error;
  transactions: Transaction[];
  lastAddress?: Address;
}

export const initialState: State = {
  loading: true,
  transactions: []
};

export function reducer(state = initialState, action: HistoryActions): State {
  switch (action.type) {
    case HistoryActionTypes.LoadHistories: {
      if (state.lastAddress && state.lastAddress.equals(action.payload.address) && !action.payload.refresh) {
        return state;
      }
      return {
        ...state,
        loading: true
      };
    }
    case HistoryActionTypes.LoadHistoriesSuccess: {
      return {
        ...state,
        loading: false,
        transactions: action.payload.transactions,
        lastAddress: action.payload.address
      };
    }
    case HistoryActionTypes.LoadHistoriesError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}
