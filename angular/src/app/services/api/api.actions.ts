import { Action } from '@ngrx/store';

export enum ApiActionTypes {
  LoadApis = '[Api] Load Apis',
  
  
}

export class LoadApis implements Action {
  readonly type = ApiActionTypes.LoadApis;
}


export type ApiActions = LoadApis;
