import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Wallet } from './wallet.model';
import { WalletActions, WalletActionTypes } from './wallet.actions';

export interface State extends EntityState<Wallet> {
  loading: boolean;
  error?: Error;
  currentWallet?: string;
  lastUserId?: string;
}

export const adapter: EntityAdapter<Wallet> = createEntityAdapter<Wallet>();

export const initialState: State = adapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: WalletActions
): State {
  switch (action.type) {
    case WalletActionTypes.LoadWallets: {
      return {
        ...state,
        loading: true
      }
    }

    case WalletActionTypes.LoadWalletsSuccess: {
      return {
        ...state,
        loading: false
      }
    }

    case WalletActionTypes.LoadWalletsFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case WalletActionTypes.AddWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case WalletActionTypes.AddWalletSuccess: {
      const entities = { ...state.entities };
      entities[action.payload.id] = action.payload.wallet;
      return {
        ...state,
        ids: (state.ids as string[]).concat([action.payload.id]),
        entities: entities
      };
    }

    case WalletActionTypes.AddWalletFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case WalletActionTypes.UpdateWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case WalletActionTypes.UpdateWalletSuccess: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload.wallet }, state),
        loading: false
      }
    }

    case WalletActionTypes.UpdateWalletFailed: {
      return {
        ...state,
        loading: false
      }
    }

    case WalletActionTypes.DeleteWallet: {
      return {
        ...state,
        loading: true
      }
    }

    case WalletActionTypes.DeleteWalletSuccess: {
      return {
        ...adapter.removeOne(action.payload.id, state),
        loading: false,
      }
    }

    case WalletActionTypes.DeleteWalletFailed: {
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

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
