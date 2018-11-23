import { Action } from '@ngrx/store';

export enum LocalWalletActionTypes {
  LoadLocalWallets = '[LocalWallet] Load LocalWallet',
  LoadLocalWalletsSuccess = '[LocalWallet] Load LocalWallet Success',
  LoadLocalWalletsFailed = '[LocalWallet] Load LocalWallet Failed'
}

export class LoadLocalWallets implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWallets;

  constructor(
    public payload: {
      localStorage: Storage;
    }
  ) { }
}

export class LoadLocalWalletsSuccess implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletsSuccess;

  constructor(
    public payload: {
      localWallets: {
        [id: string]: string
      }
    }
  ) { }
}

export class LoadLocalWalletsFailed implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletsFailed;

  constructor(
    error: Error
  ) { }
}

export type LocalWalletActions =
  LoadLocalWallets
  | LoadLocalWalletsSuccess
  | LoadLocalWalletsFailed
