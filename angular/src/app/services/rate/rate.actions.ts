import { Action } from '@ngrx/store';
import { Address, Asset } from 'nem-library';
import { Rate } from '../../../../../firebase/functions/src/models/rate';

export enum RateActionTypes {
  LoadRates = 'LoadRates',
  LoadRatesSuccess = 'LoadRatesSuccess',
  LoadRatesError = 'LoadRatesError',
  ChangeCurrency = 'ChangeCurrency'
}

export class LoadRates implements Action {
  readonly type = RateActionTypes.LoadRates;

  constructor(public payload: { refresh?: boolean }) {}
}

export class LoadRatesSuccess implements Action {
  readonly type = RateActionTypes.LoadRatesSuccess;

  constructor(public payload: { rate: Rate }) {}
}

export class LoadRatesError implements Action {
  readonly type = RateActionTypes.LoadRatesError;

  constructor(public payload: { error: Error }) {}
}

export class ChangeCurrency implements Action {
  readonly type = RateActionTypes.ChangeCurrency;

  constructor(public payload: { currency: string }) {}
}


export type RateActions = LoadRates | LoadRatesSuccess | LoadRatesError | ChangeCurrency;
