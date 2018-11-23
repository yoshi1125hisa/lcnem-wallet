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

    case LocalWalletActionTypes.AddLcalWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case LocalWalletActionTypes.AddLocalWalletSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case LocalWalletActionTypes.AddLocalWalletFailed: {
      return {
        ...state,
        loading: false
      }
    }
    case LocalWalletActionTypes.UpdateLocalWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case LocalWalletActionTypes.UpdateLocalWalletSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case LocalWalletActionTypes.UpdateLocalWalletFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case LocalWalletActionTypes.DeleteLocalWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case LocalWalletActionTypes.DeleteLocalWalletSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case LocalWalletActionTypes.DeleteLocalWalletFailed: {
      return {
        ...state,
        loading: false
      }
    }

    default:
      return state;
  }
}
