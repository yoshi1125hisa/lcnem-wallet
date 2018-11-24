import { Action } from '@ngrx/store';

export enum WithdrawActionTypes {
  LoadWithdraws = '[Withdraw] Load Withdraws'
}

export class LoadWithdraws implements Action {
  readonly type = WithdrawActionTypes.LoadWithdraws;
}

export type WithdrawActions = LoadWithdraws;
