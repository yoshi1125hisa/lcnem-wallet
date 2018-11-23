import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as UserReducer from './user/user.reducer';
import * as WalletReducer from './wallet/wallet.reducer';
import * as ContactReducer from './contact/contact.reducer';
import * as NemBalanceReducer from './nem/balance/balance.reducer';
import * as LanguageReducer from './language/language.reducer';

export interface State {
  user: UserReducer.State,
  wallet: WalletReducer.State,
  contact: ContactReducer.State,
  nem: {
    balance: NemBalanceReducer.State
  },
  language: LanguageReducer.State
}

export const reducers: ActionReducerMap<State, any> = {
  user: UserReducer.reducer,
  wallet: WalletReducer.reducer,
  contact: ContactReducer.reducer,
  nemBalance: NemBalanceReducer.reducer,
  language: LanguageReducer.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
