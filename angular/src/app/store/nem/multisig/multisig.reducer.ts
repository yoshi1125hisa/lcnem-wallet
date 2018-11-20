import { MultisigActions, MultisigActionTypes } from './multisig.actions';
import { Address } from 'nem-library';

export interface State {
  multisigs: Address[]
  loading: boolean;
  error?: Error
}

export const initialState: State = {
  multisigs: [],
  loading: false
};

export function reducer(
  state = initialState,
  action: MultisigActions
): State {
  switch (action.type) {

    case MultisigActionTypes.LoadMultisigs: {
      return {
        ...state,
        loading: true
      }
    }

    case MultisigActionTypes.LoadMultisigsSuccess: {
      return {
        multisigs: action.payload.multisigs,
        loading: false
      }
    }

    case MultisigActionTypes.LoadMultisigsFailed: {
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
