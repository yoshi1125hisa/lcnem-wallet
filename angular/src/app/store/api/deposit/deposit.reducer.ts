import { Action } from '@ngrx/store';
import { DepositActionTypes } from './deposit.actions';

export interface State {
  loading: boolean;
}

export const initialState: State = {
  loading: false
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {

    case DepositActionTypes.SendDepositRequest:
      return {
        loading: true
      }
    case DepositActionTypes.SendDepositRequestSuccess:
      return {
        loading: false
      }
    case DepositActionTypes.SendDepositRequestFailed:
      return {
        loading: false
      }

    default:
      return state;
  }
}
