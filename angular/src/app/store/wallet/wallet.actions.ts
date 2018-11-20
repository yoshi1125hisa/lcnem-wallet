import { Action } from '@ngrx/store';
import { Wallet } from './wallet.model';
import { Dictionary } from '@ngrx/entity';

export enum WalletActionTypes {
  LoadWallets = '[Wallet] Load Wallets',
  LoadWalletsSuccess = '[Wallet] Load Wallets Success',
  LoadWalletsFailed = '[Wallet] Load Wallets Failed',
  AddWallet = '[Wallet] Add Wallet',
  AddWalletSuccess = '[Wallet] Add Wallet Success',
  AddWalletFailed = '[Wallet] Add Wallet Failed',
  UpdateWallet = '[Wallet] Update Wallet',
  UpdateWalletSuccess = '[Wallet] Update Wallet Success',
  UpdateWalletFailed = '[Wallet] Update Wallet Failed',
  DeleteWallet = '[Wallet] Delete Wallet',
  DeleteWalletSuccess = '[Wallet] Delete Wallet Success',
  DeleteWalletFailed = '[Wallet] Delete Wallet Failed'
}

export class LoadWallets implements Action {
  readonly type = WalletActionTypes.LoadWallets;

  constructor(
    public payload: {
      userId: string;
    }
  ) { }
}

export class LoadWalletsSuccess implements Action {
  readonly type = WalletActionTypes.LoadWalletsSuccess;

  constructor(
    public payload: {
      wallets: Dictionary<Wallet>;
    }
  ) { }
}

export class LoadWalletsFailed implements Action {
  readonly type = WalletActionTypes.LoadWalletsFailed;

  constructor(
    error: Error
  ) { }
}

export class AddWallet implements Action {
  readonly type = WalletActionTypes.AddWallet;

  constructor(
    public payload: {
      userId: string;
      wallet: Wallet;
    }
  ) { }
}


export class AddWalletSuccess implements Action {
  readonly type = WalletActionTypes.AddWalletSuccess;

  constructor(
    public payload: {
      id: string;
      wallet: Wallet;
    }
  ) { }
}

export class AddWalletFailed implements Action {
  readonly type = WalletActionTypes.AddWalletFailed;

  constructor(
    error: Error
  ) { }
}

export class UpdateWallet implements Action {
  readonly type = WalletActionTypes.UpdateWallet;

  constructor(
    public payload: {
      userId: string;
      id: string;
      wallet: Wallet;
    }
  ) { }
}

export class UpdateWalletSuccess implements Action {
  readonly type = WalletActionTypes.UpdateWalletSuccess;

  constructor(
    public payload: {
      id: string;
      wallet: Wallet;
    }
  ) { }
}

export class UpdateWalletFailed implements Action {
  readonly type = WalletActionTypes.UpdateWalletFailed;

  constructor(
    error: Error
  ) { }
}

export class DeleteWallet implements Action {
  readonly type = WalletActionTypes.DeleteWallet;

  constructor(
    public payload: {
      userId: string;
      id: string;
    }
  ) { }
}

export class DeleteWalletSuccess implements Action {
  readonly type = WalletActionTypes.DeleteWalletSuccess;

  constructor(
    public payload: {
      id: string;
    }
  ) { }
}

export class DeleteWalletFailed implements Action {
  readonly type = WalletActionTypes.DeleteWalletFailed;

  constructor(
    error: Error
  ) { }
}

export type WalletActions =
  LoadWallets
  | LoadWalletsSuccess
  | LoadWalletsFailed
  | AddWallet
  | AddWalletSuccess
  | AddWalletFailed
  | UpdateWallet
  | UpdateWalletSuccess
  | UpdateWalletFailed
  | DeleteWallet
  | DeleteWalletSuccess
  | DeleteWalletFailed
