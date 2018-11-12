import { Action } from '@ngrx/store';

export enum BalanceActionTypes {
  ReadBalances = '[Balance] Read Balances'
}

export class ReadBalances implements Action {
  readonly type = BalanceActionTypes.ReadBalances;
}

export type BalanceActions = ReadBalances;
