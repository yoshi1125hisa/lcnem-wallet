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
      };
    }

    case LocalWalletActionTypes.LoadLocalWalletsComplete: {
      return {
        ...state,
        loading: false,
        localWallets: action.payload.localWallets
      };
    }

    case LocalWalletActionTypes.AddLocalWallet: {
      return {
        ...state,
        loading: true
      };
    }

    case LocalWalletActionTypes.AddLocalWalletSuccess: {
      return {
        ...state,
        loading: false,
        localWallets: action.payload.localWallets
      };
    }

    case LocalWalletActionTypes.AddLocalWalletFailed: {
      return {
        ...state,
        loading: false
      };
    }

    case LocalWalletActionTypes.DeleteLocalWallet: {
      return {
        ...state,
        loading: true
      };
    }

    case LocalWalletActionTypes.DeleteLocalWalletSuccess: {
      return {
        ...state,
        loading: false,
        localWallets: action.payload.localWallets
      };
    }

    case LocalWalletActionTypes.DeleteLocalWalletFailed: {
      return {
        ...state,
        loading: false
      };
    }

    default:
      return state;
  }
}
