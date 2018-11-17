import { HistoryActions, HistoryActionTypes } from './history.actions';
import { Transaction } from 'nem-library';

export interface State {
  transactions: Transaction[];
}

export const initialState: State = {
  transactions: []
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
        transactions: action.payload.transactions
      };
    }
    default: {
      return state;
    }
  }
}
