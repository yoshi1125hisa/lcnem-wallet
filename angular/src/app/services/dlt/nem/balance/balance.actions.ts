import { Action } from '@ngrx/store';
import { Address, Asset } from 'nem-library';

export enum BalanceActionTypes {
  LoadBalances = 'LoadBalances',
  LoadBalancesSuccess = 'LoadBalancesSuccess',
  LoadBalancesError = 'LoadBalancesError'
}

export class LoadBalances implements Action {
  readonly type = BalanceActionTypes.LoadBalances;

  constructor(public payload: { address: Address, refresh?: boolean }) {}
}

export class LoadBalancesSuccess implements Action {
  readonly type = BalanceActionTypes.LoadBalancesSuccess;

  constructor(public payload: { address: Address, assets: Asset[] }) {}
}

export class LoadBalancesError implements Action {
  readonly type = BalanceActionTypes.LoadBalancesError;

  constructor(public payload: { error: Error }) {}
}


export type BalanceActions = LoadBalances | LoadBalancesSuccess | LoadBalancesError;
