import { Action } from '@ngrx/store';
import {
  LocalWalletActionTypes,
  LocalWalletActions
} from './local-wallet.actions';


export interface State {
  loading: boolean;
  localWallets: {
    [id: string]: string
  }
  error?: Error;
}

export const initialState: State = {
  loading: false,
  localWallets: {}
};

export function reducer(
  state = initialState,
  action: LocalWalletActions
): State {
  switch (action.type) {
    case LocalWalletActionTypes.LoadLocalWallets: {
      return {
        ...state,
        loading: true
      }
    }

    case LocalWalletActionTypes.LoadLocalWalletsSuccess: {
      return {
        ...state,
        loading: false
      }
    }
    case LocalWalletActionTypes.LoadLocalWalletsFailed: {
      return {
        ...state,
        loading: false
      }
    }

    default:
      return state;
  }
}
