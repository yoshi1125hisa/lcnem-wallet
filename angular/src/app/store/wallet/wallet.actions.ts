import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Wallet } from '../../../../../firebase/functions/src/models/wallet';

export enum WalletActionTypes {
  LoadWallets = '[Wallet] Load Wallets',
  LoadWalletsSuccess = '[Wallet] Load Wallets Success',
  LoadWalletsFailed = '[Wallet] Load Wallets Failed',
  AddWallet = '[Wallet] Add Wallet',
  AddWalletSuccess = '[Wallet] Add Wallet Success',
  AddWalletFailed = '[Wallet] Add Wallet Failed',
  UpsertWallet = '[Wallet] Upsert Wallet',
  AddWallets = '[Wallet] Add Wallets',
  UpsertWallets = '[Wallet] Upsert Wallets',
  UpdateWallet = '[Wallet] Update Wallet',
  UpdateWalletSuccess = '[Wallet] Update Wallet Success',
  UpdateWalletFailed = '[Wallet] Update Wallet Failed',
  UpdateWallets = '[Wallet] Update Wallets',
  DeleteWallet = '[Wallet] Delete Wallet',
  DeleteWalletSuccess = '[Wallet] Delete Wallet Success',
  DeleteWalletFailed = '[Wallet] Delete Wallet Failed',
  DeleteWallets = '[Wallet] Delete Wallets',
  ClearWallets = '[Wallet] Clear Wallets'
}

export class LoadWallets implements Action {
  readonly type = WalletActionTypes.LoadWallets;

  constructor(public payload: { wallets: Wallet[] }) { }
}

export class LoadWalletsSuccess implements Action {
  readonly type = WalletActionTypes.LoadWalletsSuccess;

  constructor() { }
}

export class LoadWalletsFailed implements Action {
  readonly type = WalletActionTypes.LoadWalletsFailed;

  constructor() { }
}

export class AddWallet implements Action {
  readonly type = WalletActionTypes.AddWallet;

  constructor(public payload: { wallet: Wallet }) { }
}


export class AddWalletSuccess implements Action {
  readonly type = WalletActionTypes.AddWalletSuccess;

  constructor() { }
}

export class AddWalletFailed implements Action {
  readonly type = WalletActionTypes.AddWalletFailed;

  constructor() { }
}

export class UpsertWallet implements Action {
  readonly type = WalletActionTypes.UpsertWallet;

  constructor(public payload: { wallet: Wallet }) { }
}

export class AddWallets implements Action {
  readonly type = WalletActionTypes.AddWallets;

  constructor(public payload: { wallets: Wallet[] }) { }
}

export class UpsertWallets implements Action {
  readonly type = WalletActionTypes.UpsertWallets;

  constructor(public payload: { wallets: Wallet[] }) { }
}

export class UpdateWallet implements Action {
  readonly type = WalletActionTypes.UpdateWallet;

  constructor(public payload: { wallet: Update<Wallet> }) { }
}

export class UpdateWalletSuccess implements Action {
  readonly type = WalletActionTypes.UpdateWalletSuccess;

  constructor() { }
}

export class UpdateWalletFailed implements Action {
  readonly type = WalletActionTypes.UpdateWalletFailed;

  constructor() { }
}

export class UpdateWallets implements Action {
  readonly type = WalletActionTypes.UpdateWallets;

  constructor(public payload: { wallets: Update<Wallet>[] }) { }
}

export class DeleteWallet implements Action {
  readonly type = WalletActionTypes.DeleteWallet;

  constructor(public payload: { id: string }) { }
}

export class DeleteWalletSuccess implements Action {
  readonly type = WalletActionTypes.DeleteWalletSuccess;

  constructor() { }
}

export class DeleteWalletFailed implements Action {
  readonly type = WalletActionTypes.DeleteWalletFailed;

  constructor() { }
}

export class DeleteWallets implements Action {
  readonly type = WalletActionTypes.DeleteWallets;

  constructor(public payload: { ids: string[] }) { }
}

export class ClearWallets implements Action {
  readonly type = WalletActionTypes.ClearWallets;
}

export type WalletActions =
  LoadWallets
  | AddWallet
  | UpsertWallet
  | AddWallets
  | UpsertWallets
  | UpdateWallet
  | UpdateWallets
  | DeleteWallet
  | DeleteWallets
  | ClearWallets;
