import { Action } from '@ngrx/store';
import { Transaction } from 'nem-library';

export enum HistoryActionTypes {
  LoadHistories = 'LoadHistories',
  LoadHistoriesSuccess = "LoadHidtoriesSuccess",
  LoadHistoriesError = "LoadHistoriesError"
}

export class LoadHistories implements Action {
  readonly type = HistoryActionTypes.LoadHistories;

  constructor(public payload: { nem: string }) {}
}

export class LoadHistoriesSuccess implements Action {
  readonly type = HistoryActionTypes.LoadHistoriesSuccess;

  constructor(public payload: { transactions: Transaction[] }) {}
}

export class LoadHistoriesError implements Action {
  readonly type = HistoryActionTypes.LoadHistoriesError;

  constructor(public payload: { error: Error }) {}
}

export type HistoryActions = LoadHistories | LoadHistoriesSuccess | LoadHistoriesError;
