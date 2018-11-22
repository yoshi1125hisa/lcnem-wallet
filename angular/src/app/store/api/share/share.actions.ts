import { Action } from '@ngrx/store';

export enum ShareActionTypes {
  LoadShares = '[Share] Load Shares'
}

export class LoadShares implements Action {
  readonly type = ShareActionTypes.LoadShares;
}

export type ShareActions = LoadShares;
