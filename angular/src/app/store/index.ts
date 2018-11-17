import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as ContactReducer from './contact/contact.reducer';
import * as WalletReducer from './wallet/wallet.reducer';

export interface State {
  contact: ContactReducer.State,
  wallet: WalletReducer.State
}

export const reducers: ActionReducerMap<State> = {
  contact: ContactReducer.reducer,
  wallet: WalletReducer.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
