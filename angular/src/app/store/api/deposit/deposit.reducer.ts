import { Action } from '@ngrx/store';
import { DepositActionTypes, DepositActions } from './deposit.actions';

export interface State {
  loading: boolean;
  error?: Error;
}

export const initialState: State = {
  loading: false
};

export function reducer(
  state = initialState,
  action: DepositActions
): State {
  switch (action.type) {
    case DepositActionTypes.SendDepositRequest: {
      return {
        loading: true
      }
    }
    case DepositActionTypes.SendDepositRequestSuccess: {
      return {
        loading: false
      }
    }
    case DepositActionTypes.SendDepositRequestFailed: {
      return {
        loading: false,
        error: action.error
      }
    }

    default:
      return state;
  }
}
