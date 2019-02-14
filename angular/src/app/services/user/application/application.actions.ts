import { Action } from '@ngrx/store';

export enum ApplicationActionTypes {
  LoadApplications = '[Application] Load Applications',
  
  
}

export class LoadApplications implements Action {
  readonly type = ApplicationActionTypes.LoadApplications;
}


export type ApplicationActions = LoadApplications;
