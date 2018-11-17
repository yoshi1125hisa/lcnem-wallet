import { HistoryActions, HistoryActionTypes } from './history.actions';
import { Transaction } from 'nem-library';

export interface State {
  transactions: Transaction[];
  loading: boolean;
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
      return state;
    }
    case HistoryActionTypes.LoadHistorysSuccess: {
      return {
        transactions: action.payload.transactions,
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}
