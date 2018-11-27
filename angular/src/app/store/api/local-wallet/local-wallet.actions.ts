import { Action } from '@ngrx/store';

export enum LocalWalletActionTypes {
  LoadLocalWallets = '[LocalWallet] Load LocalWallets',
  LoadLocalWalletsComplete = '[LocalWallet] Load LocalWallets Complete',
  AddLocalWallet = '[LocalWallet] Add LocalWallet',
  AddLocalWalletSuccess = '[LocalWallet] Add LocalWallet Success',
  AddLocalWalletFailed = '[LocalWallet] Add LocalWallet Failed',
  DeleteLocalWallet = '[LocalWallet] Delete LocalWallet',
  DeleteLocalWalletSuccess = '[LocalWallet] Delete LocalWallet Success',
  DeleteLocalWalletFailed = '[LocalWallet] Delete LocalWallet Failed',
}

export class LoadLocalWallets implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWallets;

  constructor() { }
}

export class LoadLocalWalletsComplete implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletsComplete;

  constructor(
    public payload: {
      localWallets: {
        [id: string]: string;
      };
    }
  ) { }
}

export class AddLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWallet;

  constructor(
    public payload: {
      id: string;
      wallet: string;
    }
  ) { }
}

export class AddLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWalletSuccess;

  constructor(
    public payload: {
      localWallets: {
        [id: string]: string;
      };
    }
  ) { }
}

export class AddLocalWalletFailed implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWalletFailed;

  constructor(
    error: Error
  ) { }
}

export class DeleteLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWallet;

  constructor(
    public payload: {
      id: string;
    }
  ) { }
}

export class DeleteLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWalletSuccess;

  constructor(
    public payload: {
      localWallets: {
        [id: string]: string
      }
    }
  ) { }
}

export class DeleteLocalWalletFailed implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWalletFailed;

  constructor(
    error: Error
  ) { }
}

export type LocalWalletActions =
  LoadLocalWallets
  | LoadLocalWalletsComplete
  | AddLocalWallet
  | AddLocalWalletSuccess
  | AddLocalWalletFailed
  | DeleteLocalWallet
  | DeleteLocalWalletSuccess
  | DeleteLocalWalletFailed
