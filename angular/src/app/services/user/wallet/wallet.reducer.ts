import { Action } from '@ngrx/store';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';
import { WalletActionTypes, WalletActions } from './wallet.actions';


export interface State {
  loading: boolean
  error?: Error
  ids: string[]
  entities: { [id: string]: Wallet }
  currentWalletId?: string
  lastUserId?: string
}

export const initialState: State = {
  loading: true,
  ids: [],
  entities: {}
};

export function reducer(state = initialState, action: WalletActions): State {
  switch (action.type) {
    case WalletActionTypes.LoadWallets: {
      return {
        ...state,
        loading: true,
      }
    }
    case WalletActionTypes.LoadWalletsSuccess: {
      return {
        ...state,
        loading: false,
        ids: action.payload.ids,
        entities: action.payload.entities,
        currentWalletId: action.payload.currentWalletId,
        lastUserId: action.payload.userId
      }
    }
    case WalletActionTypes.LoadWalletsError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case WalletActionTypes.AddWallet: {
      return {
        ...state,
        loading: true
      }
    }
    case WalletActionTypes.AddWalletSuccess: {
      const ids = [...state.ids, action.payload.walletId]
      const entities = {...state.entities}
      entities[action.payload.walletId] = action.payload.wallet

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      }
    }
    case WalletActionTypes.AddWalletError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case WalletActionTypes.UpdateWallet: {
      return {
        ...state,
        loading: true,
      }
    }
    case WalletActionTypes.UpdateWalletSuccess: {
      const entities = {...state.entities}
      entities[action.payload.walletId] = action.payload.wallet

      return {
        ...state,
        loading: false,
      }
    }
    case WalletActionTypes.UpdateWalletError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case WalletActionTypes.DeleteWallet: {
      return {
        ...state,
        loading: true,
      }
    }
    case WalletActionTypes.DeleteWalletSuccess: {
      const ids = state.ids.filter(id => id !== action.payload.walletId)
      const entities = {...state.entities}
      delete entities[action.payload.walletId]

      return {
        ...state,
        loading: false,
        ids: ids,
        entities: entities
      }
    }
    case WalletActionTypes.DeleteWalletError: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    }
    case WalletActionTypes.SetCurrentWallet: {
      return {
        ...state,
        currentWalletId: action.payload.walletId
      }
    }
    default: {
      return state;
    }
  }
}
