import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromUser from './user/user.reducer';
import * as fromRate from './rate/rate.reducer';
import * as fromWallet from './user/wallet/wallet.reducer';
import * as fromContact from './user/contact/contact.reducer';
import * as fromApplication from './user/application/application.reducer';
import * as fromAssetDefinition from './dlt/asset-definition/asset-definition.reducer';
import * as fromBalance from './dlt/nem/balance/balance.reducer';
import * as fromHistory from './dlt/nem/history/history.reducer';
import * as fromMultisig from './dlt/nem/multisig/multisig.reducer';

export interface State {

  user: fromUser.State;
  rate: fromRate.State;
  wallet: fromWallet.State;
  contact: fromContact.State;
  application: fromApplication.State;
  assetDefinition: fromAssetDefinition.State;
  balance: fromBalance.State;
  history: fromHistory.State;
  multisig: fromMultisig.State;
}

export const reducers: ActionReducerMap<State> = {

  user: fromUser.reducer,
  rate: fromRate.reducer,
  wallet: fromWallet.reducer,
  contact: fromContact.reducer,
  application: fromApplication.reducer,
  assetDefinition: fromAssetDefinition.reducer,
  balance: fromBalance.reducer,
  history: fromHistory.reducer,
  multisig: fromMultisig.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
