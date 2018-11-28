import { Action } from '@ngrx/store';
import {
  WithdrawRequestActionTypes,
  WithdrawRequestActions
} from './withdraw.actions';

export interface State {
  loading: boolean;
  error?: Error;
}

export const initialState: State = {
  loading: false
};

export function reducer(
  state = initialState,
  action: WithdrawRequestActions
): State {
  switch (action.type) {
    case WithdrawRequestActionTypes.SendWithdrawRequest: {
      return {
        loading: true
      };
    }
    case WithdrawRequestActionTypes.SendWithdrawRequestSuccess: {
      return {
        loading: false
      };
    }
    case WithdrawRequestActionTypes.SendWithdrawRequestFailed: {
      return {
        loading: false,
        error: action.error
      };
    }

    default: {
      return state;
    }
  }
}
