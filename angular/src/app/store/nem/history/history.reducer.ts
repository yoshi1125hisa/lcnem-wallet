import { HistoryActions, HistoryActionTypes } from './history.actions';
import { Transaction } from 'nem-library';

export interface State {
  transactions: Transaction[];
  loading: boolean;
  error?: Error;
}

export const initialState: State = {
  transactions: [],
  loading: false
};

export function reducer(
  state = initialState,
  action: HistoryActions
): State {
  switch (action.type) {
    case HistoryActionTypes.LoadHistorys: {
      return {
        ...state,
        loading: true
      };
    }

    case HistoryActionTypes.LoadHistorysSuccess: {
      return {
        transactions: action.payload.transactions,
        loading: false
      };
    }

    case HistoryActionTypes.LoadHistorysFailed: {
      return {
        ...state,
        loading: false
      }
    }

    default: {
      return state;
    }
  }
}
