import { Action } from '@ngrx/store';
import { Address } from 'nem-library';
import { MultisigActions, MultisigActionTypes } from './multisig.actions';


export interface State {
  loading: boolean
  error?: Error
  addresses: Address[],
  lastAddress?: Address
}

export const initialState: State = {
  loading: false,
  addresses: []
};

export function reducer(state = initialState, action: MultisigActions): State {
  switch (action.type) {
    case MultisigActionTypes.LoadMultisigs: {
      return {
        ...state,
        loading: true,
        lastAddress: action.payload.address
      }
    }
    case MultisigActionTypes.LoadMultisigsSuccess: {
      return {
        ...state,
        loading: false,
        addresses: action.payload.addresses
      }
    }
    case MultisigActionTypes.LoadMultisigsError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    default: {
      return state;
    }
  }
}
