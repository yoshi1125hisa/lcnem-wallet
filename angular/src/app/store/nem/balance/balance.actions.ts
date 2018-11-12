import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Balance } from './balance.model';

export enum BalanceActionTypes {
  LoadBalances = '[Balance] Load Balances',
  AddBalance = '[Balance] Add Balance',
  UpsertBalance = '[Balance] Upsert Balance',
  AddBalances = '[Balance] Add Balances',
  UpsertBalances = '[Balance] Upsert Balances',
  UpdateBalance = '[Balance] Update Balance',
  UpdateBalances = '[Balance] Update Balances',
  DeleteBalance = '[Balance] Delete Balance',
  DeleteBalances = '[Balance] Delete Balances',
  ClearBalances = '[Balance] Clear Balances'
}

export class LoadBalances implements Action {
  readonly type = BalanceActionTypes.LoadBalances;

  constructor(public payload: { balances: Balance[] }) {}
}

export class AddBalance implements Action {
  readonly type = BalanceActionTypes.AddBalance;

  constructor(public payload: { balance: Balance }) {}
}

export class UpsertBalance implements Action {
  readonly type = BalanceActionTypes.UpsertBalance;

  constructor(public payload: { balance: Balance }) {}
}

export class AddBalances implements Action {
  readonly type = BalanceActionTypes.AddBalances;

  constructor(public payload: { balances: Balance[] }) {}
}

export class UpsertBalances implements Action {
  readonly type = BalanceActionTypes.UpsertBalances;

  constructor(public payload: { balances: Balance[] }) {}
}

export class UpdateBalance implements Action {
  readonly type = BalanceActionTypes.UpdateBalance;

  constructor(public payload: { balance: Update<Balance> }) {}
}

export class UpdateBalances implements Action {
  readonly type = BalanceActionTypes.UpdateBalances;

  constructor(public payload: { balances: Update<Balance>[] }) {}
}

export class DeleteBalance implements Action {
  readonly type = BalanceActionTypes.DeleteBalance;

  constructor(public payload: { id: string }) {}
}

export class DeleteBalances implements Action {
  readonly type = BalanceActionTypes.DeleteBalances;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearBalances implements Action {
  readonly type = BalanceActionTypes.ClearBalances;
}

export type BalanceActions =
 LoadBalances
 | AddBalance
 | UpsertBalance
 | AddBalances
 | UpsertBalances
 | UpdateBalance
 | UpdateBalances
 | DeleteBalance
 | DeleteBalances
 | ClearBalances;
