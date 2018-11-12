import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Wallet } from './wallet.model';

export enum WalletActionTypes {
  LoadWallets = '[Wallet] Load Wallets',
  AddWallet = '[Wallet] Add Wallet',
  UpsertWallet = '[Wallet] Upsert Wallet',
  AddWallets = '[Wallet] Add Wallets',
  UpsertWallets = '[Wallet] Upsert Wallets',
  UpdateWallet = '[Wallet] Update Wallet',
  UpdateWallets = '[Wallet] Update Wallets',
  DeleteWallet = '[Wallet] Delete Wallet',
  DeleteWallets = '[Wallet] Delete Wallets',
  ClearWallets = '[Wallet] Clear Wallets'
}

export class LoadWallets implements Action {
  readonly type = WalletActionTypes.LoadWallets;

  constructor(public payload: { wallets: Wallet[] }) {}
}

export class AddWallet implements Action {
  readonly type = WalletActionTypes.AddWallet;

  constructor(public payload: { wallet: Wallet }) {}
}

export class UpsertWallet implements Action {
  readonly type = WalletActionTypes.UpsertWallet;

  constructor(public payload: { wallet: Wallet }) {}
}

export class AddWallets implements Action {
  readonly type = WalletActionTypes.AddWallets;

  constructor(public payload: { wallets: Wallet[] }) {}
}

export class UpsertWallets implements Action {
  readonly type = WalletActionTypes.UpsertWallets;

  constructor(public payload: { wallets: Wallet[] }) {}
}

export class UpdateWallet implements Action {
  readonly type = WalletActionTypes.UpdateWallet;

  constructor(public payload: { wallet: Update<Wallet> }) {}
}

export class UpdateWallets implements Action {
  readonly type = WalletActionTypes.UpdateWallets;

  constructor(public payload: { wallets: Update<Wallet>[] }) {}
}

export class DeleteWallet implements Action {
  readonly type = WalletActionTypes.DeleteWallet;

  constructor(public payload: { id: string }) {}
}

export class DeleteWallets implements Action {
  readonly type = WalletActionTypes.DeleteWallets;

  constructor(public payload: { ids: string[] }) {}
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
