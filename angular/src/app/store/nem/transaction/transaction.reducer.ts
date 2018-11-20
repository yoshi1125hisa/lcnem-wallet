import { TransactionActions, TransactionActionTypes } from './transaction.actions';

export interface State {
  // additional entities state properties
}

export const initialState: State = {
  // additional entity state properties
};

export function reducer(
  state = initialState,
  action: TransactionActions
): State {
  switch (action.type) {
    case TransactionActionTypes.SendTransferTransaction: {
      return {
        ...state
      }
    }

    default: {
      return state;
    }
  }
}
