import { Action } from '@ngrx/store';

export enum LocalWalletActionTypes {
  LoadLocalWallets = '[LocalWallet] Load LocalWallets',
  LoadLocalWalletsSuccess = '[LocalWallet] Load LocalWallets Success',
  LoadLocalWalletsFailed = '[LocalWallet] Load LocalWallets Failed',
  AddLcalWallet = '[LocalWallet] Add LocalWallet',
  AddLocalWalletSuccess = '[LocalWallet] Add LocalWallet Success',
  AddLocalWalletFailed = '[LocalWallet] Add LocalWallet Failed',
  UpdateLocalWallet = '[LocalWallet] Update LocalWallet',
  UpdateLocalWalletSuccess = '[LocalWallet] Update LocalWallet Success',
  UpdateLocalWalletFailed = '[LocalWallet] Update LocalWallet Failed',
  DeleteLocalWallet = '[LocalWallet] Delete LocalWallet',
  DeleteLocalWalletSuccess = '[LocalWallet] Delete LocalWallet Success',
  DeleteLocalWalletFailed = '[LocalWallet] Delete LocalWallet Failed',
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
    public payload: {}
  ) { }
}

export class LoadLocalWalletsFailed implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWalletsFailed;

  constructor(
    error: Error
  ) { }
}

export class AddLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.AddLcalWallet;

  constructor(
    public payload: {}
  ) { }
}

export class AddLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWalletSuccess;

  constructor(
    public payload: {}
  ) { }
}

export class AddLocalWalletFailed implements Action {
  readonly type = LocalWalletActionTypes.AddLocalWalletFailed;

  constructor(
    error: Error
  ) { }
}

export class UpdateLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.UpdateLocalWallet;

  constructor(
    public payload: {}
  ) { }
}

export class UpdateLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.UpdateLocalWalletSuccess;

  constructor(
    public payload: {}
  ) { }
}

export class UpdateLocalWalletFailed implements Action {
  readonly type = LocalWalletActionTypes.UpdateLocalWalletFailed;

  constructor(
    error: Error
  ) { }
}

export class DeleteLocalWallet implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWallet;

  constructor(
    public payload: {}
  ) { }
}

export class DeleteLocalWalletSuccess implements Action {
  readonly type = LocalWalletActionTypes.DeleteLocalWalletSuccess;

  constructor(
    public payload: {}
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
  | LoadLocalWalletsSuccess
  | LoadLocalWalletsFailed
  | AddLocalWallet
  | AddLocalWalletSuccess
  | AddLocalWalletFailed
  | UpdateLocalWallet
  | UpdateLocalWalletSuccess
  | UpdateLocalWalletFailed
  | DeleteLocalWallet
  | DeleteLocalWalletSuccess
  | DeleteLocalWalletFailed
