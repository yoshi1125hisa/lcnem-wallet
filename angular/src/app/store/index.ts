import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as ContactReducer from './contact/contact.reducer';
import * as WalletReducer from './wallet/wallet.reducer';
import * as UserReducer from './user/user.reducer';

export interface State {
  contact: ContactReducer.State,
  wallet: WalletReducer.State,
  user: UserReducer.State
}

export const reducers: ActionReducerMap<State, any> = {
  contact: ContactReducer.reducer,
  wallet: WalletReducer.reducer,
  user: UserReducer.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
