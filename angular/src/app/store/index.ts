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
import * as LocalWalletReducer from './local-wallet/local-wallet.reducer';
import * as WalletReducer from './wallet/wallet.reducer';
import * as ContactReducer from './contact/contact.reducer';
import * as ApiDepositReducer from './api/deposit/deposit.reducer';
import * as ApiWithdrawReducer from './api/withdraw/withdraw.reducer';
import * as NemAssetDefinitionReducer from './nem/asset-definition/asset-definition.reducer';
import * as NemBalanceReducer from './nem/balance/balance.reducer';
import * as NemHistoryReducer from './nem/history/history.reducer';
import * as NemMultisigReducer from './nem/multisig/multisig.reducer';
import * as NemTransactionReducer from './nem/transaction/transaction.reducer';
import * as LanguageReducer from './language/language.reducer';

export interface State {
  user: UserReducer.State,
  wallet: WalletReducer.State,
  localWallet: LocalWalletReducer.State,
  contact: ContactReducer.State,
  apiDeposit: ApiDepositReducer.State,
  apiWithdraw: ApiWithdrawReducer.State,
  nemAssetDefinition: NemAssetDefinitionReducer.State,
  nemBalance: NemBalanceReducer.State,
  NemHistory: NemHistoryReducer.State,
  NemMultisig: NemMultisigReducer.State,
  NemTransaction: NemTransactionReducer.State,
  language: LanguageReducer.State
}

export const reducers: ActionReducerMap<State, any> = {
  user: UserReducer.reducer,
  wallet: WalletReducer.reducer,
  localWallet: LocalWalletReducer.reducer,
  contact: ContactReducer.reducer,
  apiDeposit: ApiDepositReducer.reducer,
  nemAssetDefinition: NemAssetDefinitionReducer.reducer,
  nemBalance: NemBalanceReducer.reducer,
  NemHistory: NemHistoryReducer.reducer,
  NemMultisig: NemMultisigReducer.reducer,
  NemTransaction: NemTransactionReducer.reducer,
  language: LanguageReducer.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
