import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { History } from './history.model';

export enum HistoryActionTypes {
  LoadHistorys = '[History] Load Historys',
  LoadHistorysSuccess = '[History] Load Historys Success',
  LoadHistorysFailed = '[History] Load Historys Failed',
  AddHistory = '[History] Add History',
  UpsertHistory = '[History] Upsert History',
  AddHistorys = '[History] Add Historys',
  UpsertHistorys = '[History] Upsert Historys',
  UpdateHistory = '[History] Update History',
  UpdateHistorys = '[History] Update Historys',
  DeleteHistory = '[History] Delete History',
  DeleteHistorys = '[History] Delete Historys',
  ClearHistorys = '[History] Clear Historys'
}

export class LoadHistorys implements Action {
  readonly type = HistoryActionTypes.LoadHistorys;

  constructor(public payload: {
    address: Address;
    historys: History[]
  }) { }
}

export class LoadHistorysSuccess implements Action {
  readonly type = HistoryActionTypes.LoadHistorysSuccess;

  constructor() { }
}

export class LoadHistorysFailed implements Action {
  readonly type = HistoryActionTypes.LoadHistorysFailed;

  constructor() { }
}

export class AddHistory implements Action {
  readonly type = HistoryActionTypes.AddHistory;

  constructor(public payload: { history: History }) { }
}

export class UpsertHistory implements Action {
  readonly type = HistoryActionTypes.UpsertHistory;

  constructor(public payload: { history: History }) { }
}

export class AddHistorys implements Action {
  readonly type = HistoryActionTypes.AddHistorys;

  constructor(public payload: { historys: History[] }) { }
}

export class UpsertHistorys implements Action {
  readonly type = HistoryActionTypes.UpsertHistorys;

  constructor(public payload: { historys: History[] }) { }
}

export class UpdateHistory implements Action {
  readonly type = HistoryActionTypes.UpdateHistory;

  constructor(public payload: { history: Update<History> }) { }
}

export class UpdateHistorys implements Action {
  readonly type = HistoryActionTypes.UpdateHistorys;

  constructor(public payload: { historys: Update<History>[] }) { }
}

export class DeleteHistory implements Action {
  readonly type = HistoryActionTypes.DeleteHistory;

  constructor(public payload: { id: string }) { }
}

export class DeleteHistorys implements Action {
  readonly type = HistoryActionTypes.DeleteHistorys;

  constructor(public payload: { ids: string[] }) { }
}

export class ClearHistorys implements Action {
  readonly type = HistoryActionTypes.ClearHistorys;
}

export type HistoryActions =
  LoadHistorys
  | AddHistory
  | UpsertHistory
  | AddHistorys
  | UpsertHistorys
  | UpdateHistory
  | UpdateHistorys
  | DeleteHistory
  | DeleteHistorys
  | ClearHistorys;
