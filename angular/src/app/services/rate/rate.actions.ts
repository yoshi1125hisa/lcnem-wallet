import { Action } from '@ngrx/store';

export enum RateActionTypes {
  LoadRates = '[Rate] Load Rates',
  
  
}

export class LoadRates implements Action {
  readonly type = RateActionTypes.LoadRates;
}


export type RateActions = LoadRates;
