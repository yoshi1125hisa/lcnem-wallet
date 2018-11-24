import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export enum LocalWalletActionTypes {
  LoadLocalWallets = '[LocalWallet] Load LocalWallets',
  AddLocalWallet = '[LocalWallet] Add LocalWallet',
  UpsertLocalWallet = '[LocalWallet] Upsert LocalWallet',
  AddLocalWallets = '[LocalWallet] Add LocalWallets',
  UpsertLocalWallets = '[LocalWallet] Upsert LocalWallets',
  UpdateLocalWallet = '[LocalWallet] Update LocalWallet',
  UpdateLocalWallets = '[LocalWallet] Update LocalWallets',
  DeleteLocalWallet = '[LocalWallet] Delete LocalWallet',
  DeleteLocalWallets = '[LocalWallet] Delete LocalWallets',
  ClearLocalWallets = '[LocalWallet] Clear LocalWallets'
}

export class LoadLocalWallets implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWallets;

  constructor(public payload: { }) {}
}

export class AddLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWallet;

  constructor(public payload: { }) {}
}

export class DeleteLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWallet;

  constructor(public payload: { id: string }) {}
}

export type LocalWalletActions =
 LoadLocalWallets
 | AddLocalWallet
 | DeleteLocalWallet;
