import { Action } from '@ngrx/store';
import { Address, Asset } from 'nem-library';

export enum BalanceActionTypes {
  LoadBalances = '[Balance] Load Balances',
  LoadBalancesSuccess = '[Balance] Load Balances Success',
  LoadBalancesFailed = '[Balance] Load Balances Failed',
}

export class LoadBalances implements Action {
  readonly type = BalanceActionTypes.LoadBalances;

  constructor(
    public payload: {
      address: Address;
    }
  ) { }
}

export class LoadBalancesSuccess implements Action {
  readonly type = BalanceActionTypes.LoadBalancesSuccess;

  constructor(
    public payload: {
      assets: Asset[];
    }
  ) { }
}

export class LoadBalancesFailed implements Action {
  readonly type = BalanceActionTypes.LoadBalancesFailed;

  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

export type BalanceActions =
  LoadBalances
  | LoadBalancesSuccess
  | LoadBalancesFailed
