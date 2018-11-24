import { Action } from '@ngrx/store';
import { StripeActions, StripeActionTypes } from './stripe.actions';


export interface State {
  loading: boolean;
  stripe: {
    status: any;
    response: any;
  };
}

export const initialState: State = {
  loading: false,
  stripe: {
    status: {},
    response: {}
  }
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
    case StripeActionTypes.StripeChargeComplete: {
      return {
        ...state,
        loading: false,
        stripe: action.payload
      }
    }
    default:
      return state;
  }
}
