import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Wallet } from './wallet.model';
import { WalletActions, WalletActionTypes } from './wallet.actions';

export interface State extends EntityState<Wallet> {
  loading: boolean
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
    case WalletActionTypes.AddWallet: {
      return adapter.addOne(action.payload.wallet, state);
    }

    case WalletActionTypes.UpsertWallet: {
      return adapter.upsertOne(action.payload.wallet, state);
    }

    case WalletActionTypes.AddWallets: {
      return adapter.addMany(action.payload.wallets, state);
    }

    case WalletActionTypes.UpsertWallets: {
      return adapter.upsertMany(action.payload.wallets, state);
    }

    case WalletActionTypes.UpdateWallet: {
      return adapter.updateOne(action.payload.wallet, state);
    }

    case WalletActionTypes.UpdateWallets: {
      return adapter.updateMany(action.payload.wallets, state);
    }

    case WalletActionTypes.DeleteWallet: {
      return adapter.removeOne(action.payload.id, state);
    }

    case WalletActionTypes.DeleteWallets: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case WalletActionTypes.LoadWallets: {
      return adapter.addAll(action.payload.wallets, state);
    }

    case WalletActionTypes.ClearWallets: {
      return adapter.removeAll(state);
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
