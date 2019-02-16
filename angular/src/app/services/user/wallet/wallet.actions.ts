import { Action } from '@ngrx/store';
import { Wallet } from '../../../../../../firebase/functions/src/models/wallet';

export enum WalletActionTypes {
  LoadWallets = 'LoadWallets',
  LoadWalletsSuccess = 'LoadWalletsSuccess',
  LoadWalletsError = 'LoadWalletsError',
  AddWallet = 'AddWallet',
  AddWalletSuccess = 'AddWalletSuccess',
  AddWalletError = 'AddWalletError',
  UpdateWallet = 'UpdateWallet',
  UpdateWalletSuccess = 'UpdateWalletSuccess',
  UpdateWalletError = 'UpdateWalletError',
  DeleteWallet = 'DeleteWallet',
  DeleteWalletSuccess = 'DeleteWalletSuccess',
  DeleteWalletError = 'DeleteWalletError'
}

export class LoadWallets implements Action {
  readonly type = WalletActionTypes.LoadWallets;

  constructor(public payload: { userId: string, refresh?: boolean }) { }
}

export class LoadWalletsSuccess implements Action {
  readonly type = WalletActionTypes.LoadWalletsSuccess;

  constructor(public payload: { ids: string[], entities: { [id: string]: Wallet }, currentWalletId?: string }) { }
}

export class LoadWalletsError implements Action {
  readonly type = WalletActionTypes.LoadWalletsError;

  constructor(public payload: { error: Error }) { }
}

export class AddWallet implements Action {
  readonly type = WalletActionTypes.AddWallet;

  constructor(public payload: { userId: string, wallet: Wallet }) { }
}

export class AddWalletSuccess implements Action {
  readonly type = WalletActionTypes.AddWalletSuccess;

  constructor(public payload: { walletId: string, wallet: Wallet }) { }
}

export class AddWalletError implements Action {
  readonly type = WalletActionTypes.AddWalletError;

  constructor(public payload: { error: Error }) { }
}

export class UpdateWallet implements Action {
  readonly type = WalletActionTypes.UpdateWallet;

  constructor(public payload: { userId: string, walletId: string, wallet: Wallet }) { }
}

export class UpdateWalletSuccess implements Action {
  readonly type = WalletActionTypes.UpdateWalletSuccess;

  constructor(public payload: { walletId: string, wallet: Wallet }) { }
}

export class UpdateWalletError implements Action {
  readonly type = WalletActionTypes.UpdateWalletError;

  constructor(public payload: { error: Error }) { }
}

export class DeleteWallet implements Action {
  readonly type = WalletActionTypes.DeleteWallet;

  constructor(public payload: { userId: string, walletId: string }) { }
}

export class DeleteWalletSuccess implements Action {
  readonly type = WalletActionTypes.DeleteWalletSuccess;

  constructor(public payload: { walletId: string }) { }
}

export class DeleteWalletError implements Action {
  readonly type = WalletActionTypes.DeleteWalletError;

  constructor(public payload: { error: Error }) { }
}


export type WalletActions = LoadWallets | LoadWalletsSuccess | LoadWalletsError | AddWallet | AddWalletSuccess | AddWalletError | UpdateWallet | UpdateWalletSuccess | UpdateWalletError | DeleteWallet | DeleteWalletSuccess | DeleteWalletError;
