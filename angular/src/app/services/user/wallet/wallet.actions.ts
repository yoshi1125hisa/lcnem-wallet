import { Action } from '@ngrx/store';

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
}

export class LoadWalletsSuccess implements Action {
  readonly type = WalletActionTypes.LoadWalletsSuccess;
}

export class LoadWalletsError implements Action {
  readonly type = WalletActionTypes.LoadWalletsError;
}

export class AddWallet implements Action {
  readonly type = WalletActionTypes.AddWallet;
}

export class AddWalletSuccess implements Action {
  readonly type = WalletActionTypes.AddWalletSuccess;
}

export class AddWalletError implements Action {
  readonly type = WalletActionTypes.AddWalletError;
}

export class UpdateWallet implements Action {
  readonly type = WalletActionTypes.UpdateWallet;
}

export class UpdateWalletSuccess implements Action {
  readonly type = WalletActionTypes.UpdateWalletSuccess;
}

export class UpdateWalletError implements Action {
  readonly type = WalletActionTypes.UpdateWalletError;
}

export class DeleteWallet implements Action {
  readonly type = WalletActionTypes.DeleteWallet;
}

export class DeleteWalletSuccess implements Action {
  readonly type = WalletActionTypes.DeleteWalletSuccess;
}

export class DeleteWalletError implements Action {
  readonly type = WalletActionTypes.DeleteWalletError;
}


export type WalletActions = LoadWallets | LoadWalletsSuccess | LoadWalletsError | AddWallet | AddWalletSuccess | AddWalletError | UpdateWallet | UpdateWalletSuccess | UpdateWalletError | DeleteWallet | DeleteWalletSuccess | DeleteWalletError;
