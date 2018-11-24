import { Action } from '@ngrx/store';
import {
  WithdrawRequestActionTypes,
  WithdrawRequestActions
} from './withdraw.actions';

export interface State {
  send: boolean
}

export const initialState: State = {
  send: false
};

export function reducer(
  state = initialState,
  action: WithdrawRequestActions
): State {
  switch (action.type) {
    case WithdrawRequestActionTypes.SendWithdrawRequest:
      return {
        send: true
      }
    case WithdrawRequestActionTypes.SendWithdrawRequestSuccess:
      return {
        send: false
      }
    case WithdrawRequestActionTypes.SendWithdrawRequestFailed:
      return {
        send: false
      }

    default:
    return state;
  }
}
