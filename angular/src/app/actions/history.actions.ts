import { Action } from '@ngrx/store';

export enum HistoryActionTypes {
  LoadHistorys = '[History] Load Historys'
}

export class LoadHistorys implements Action {
  readonly type = HistoryActionTypes.LoadHistorys;
}

export type HistoryActions = LoadHistorys;
