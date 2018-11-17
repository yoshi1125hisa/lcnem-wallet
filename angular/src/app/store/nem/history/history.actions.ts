import { Action } from '@ngrx/store';
import { Address, Transaction } from 'nem-library';

export enum HistoryActionTypes {
  LoadHistorys = '[History] Load Historys',
  LoadHistorysSuccess = '[History] Load Historys Success',
  LoadHistorysFailed = '[History] Load Historys Failed'
}

export class LoadHistorys implements Action {
  readonly type = HistoryActionTypes.LoadHistorys;

  constructor(
    public payload: {
      address: Address;
    }
  ) { }
}

export class LoadHistorysSuccess implements Action {
  readonly type = HistoryActionTypes.LoadHistorysSuccess;

  constructor(
    public payload: {
      transactions: Transaction[];
    }
  ) { }
}

export class LoadHistorysFailed implements Action {
  readonly type = HistoryActionTypes.LoadHistorysFailed;

  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

export type HistoryActions =
  LoadHistorys
  | LoadHistorysSuccess
  | LoadHistorysFailed;
