import { Action } from '@ngrx/store';

export enum WalletActionTypes {
  CreateWallet = '[Wallet] Create Wallet',
  ReadWallets = '[Wallet] Read Wallets',
  UpdateWallet = '[Wallet] Update Wallet',
  DeleteWallet = '[Wallet] Delete Wallet'
}

export class CreateWallet implements Action {
  readonly type = WalletActionTypes.CreateWallet;
}

export class ReadWallets implements Action {
  readonly type = WalletActionTypes.ReadWallets;
}

export class UpdateWallets implements Action {
  readonly type = WalletActionTypes.UpdateWallet;
}

export class DeleteWallets implements Action {
  readonly type = WalletActionTypes.DeleteWallet;
}

export type WalletActions = CreateWallet | ReadWallets | UpdateWallets | DeleteWallets;
