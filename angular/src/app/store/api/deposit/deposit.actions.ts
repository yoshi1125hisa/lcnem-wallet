import { Action } from '@ngrx/store';

export enum DepositActionTypes {
  LoadDeposits = '[Deposit] Load Deposits'
}

export class LoadDeposits implements Action {
  readonly type = DepositActionTypes.LoadDeposits;
}

export type DepositActions = LoadDeposits;
