import { TransactionActions, TransactionActionTypes } from './transaction.actions';
import { NemAnnounceResult } from 'nem-library';

export interface State {
  transaction?: NemAnnounceResult
  error?: Error;
  loading: boolean;
}

export const initialState: State = {
  loading: false
};

export function reducer(
  state = initialState,
  action: TransactionActions
): State {
  switch (action.type) {
    case TransactionActionTypes.SendTransferTransaction: {
      return {
        ...state,
        loading: true
      }
    }
    case TransactionActionTypes.SendTransferTransactionSuccess: {
      return {
        ...state,
        transaction: action.payload.result,
        loading: false
      }
    }
    case TransactionActionTypes.SendTransferTransactionFailed: {
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
