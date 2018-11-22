import { Action } from '@ngrx/store';

export enum LocalWalletActionTypes {
  LoadLocalWallet = '[LocalWallet] Load LocalWallet',
  LoadLocalWalletSuccess = '[LocalWallet] Load LocalWallet Success',
  LoadLocalWalletFailed = '[LocalWallet] Load LocalWallet Failed'
}

export class LoadLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWallet;
}

export class LoadLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletSuccess;

  constructor(
    public payload: {
      localWallets: JSON;
    }
  ) { }
}

export class LoadLocalWalletFailed implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletFailed;

  constructor(
    error: Error
  ) { }
}

export type LocalWalletActions =
  LoadLocalWallet
  | LoadLocalWalletSuccess
  | LoadLocalWalletFailed
