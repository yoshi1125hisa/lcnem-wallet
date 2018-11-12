import { Action } from '@ngrx/store';

export enum HistoryActionTypes {
  ReadHistorys = '[History] Read Historys'
}

export class ReadHistorys implements Action {
  readonly type = HistoryActionTypes.ReadHistorys;
}

export type HistoryActions = ReadHistorys;
