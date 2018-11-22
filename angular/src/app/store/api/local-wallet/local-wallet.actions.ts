import { Action } from '@ngrx/store';

export enum LocalWalletActionTypes {
  LoadLocalWallets = '[LocalWallet] Load LocalWallets'
}

export class LoadLocalWallets implements Action {
  readonly type = LocalWalletActionTypes.LoadLocalWallets;
}

export type LocalWalletActions = LoadLocalWallets;
