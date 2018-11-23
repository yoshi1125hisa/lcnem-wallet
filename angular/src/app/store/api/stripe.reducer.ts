import { Action } from '@ngrx/store';
import { StripeActions, StripeActionTypes } from './stripe.actions';


export interface State {
  loading: boolean
}

export const initialState: State = {
  loading: false
};

export function reducer(
  state = initialState,
  action: StripeActions): State {
  switch (action.type) {
    case StripeActionTypes.StripeCharge: {
      return {
        ...state,
        loading: true
      }
    }
    case StripeActionTypes.StripeChargeSuccess: {
      return {
        ...state,
        loading: false
      }
    }
    case StripeActionTypes.StripeChargeFailed: {
      return {
        ...state,
        loading: false
      }
    }
    default:
      return state;
  }
