import { Action } from '@ngrx/store';

export enum BalanceActionTypes {
  LoadBalances = '[Balance] Load Balances',
  
  
}

export class LoadBalances implements Action {
  readonly type = BalanceActionTypes.LoadBalances;
}


export type BalanceActions = LoadBalances;
