import { Action } from '@ngrx/store';
import { Address } from 'nem-library';

export enum MultisigActionTypes {
  LoadMultisigs = 'LoadMultisigs',
  LoadMultisigsSuccess = 'LoadMultisigsSuccess',
  LoadMultisigsError = 'LoadMultisigsError'
}

export class LoadMultisigs implements Action {
  readonly type = MultisigActionTypes.LoadMultisigs;

  constructor(public payload: { address: Address, refresh?: boolean }) {}
}

export class LoadMultisigsSuccess implements Action {
  readonly type = MultisigActionTypes.LoadMultisigsSuccess;

  constructor(public payload: { address: Address, addresses: Address[] }) {}
}

export class LoadMultisigsError implements Action {
  readonly type = MultisigActionTypes.LoadMultisigsError;

  constructor(public payload: { error: Error }) {}
}


export type MultisigActions = LoadMultisigs | LoadMultisigsSuccess | LoadMultisigsError;
