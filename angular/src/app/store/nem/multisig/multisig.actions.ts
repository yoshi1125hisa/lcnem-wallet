import { Action } from '@ngrx/store';
import { Address } from 'nem-library';

export enum MultisigActionTypes {
  LoadMultisigs = '[Multisig] Load Multisigs',
  LoadMultisigsSuccess = '[Multisig] Load Multisigs Success',
  LoadMultisigsFailed = '[Multisig] Load Multisigs Failed'
}

export class LoadMultisigs implements Action {
  readonly type = MultisigActionTypes.LoadMultisigs;

  constructor(
    public payload: {
      address: Address;
    }
  ) { }
}

export class LoadMultisigsSuccess implements Action {
  readonly type = MultisigActionTypes.LoadMultisigsSuccess;

  constructor(
    public payload: {
      multisigs: Address[];
    }
  ) { }
}

export class LoadMultisigsFailed implements Action {
  readonly type = MultisigActionTypes.LoadMultisigsFailed;

  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

export type MultisigActions =
  LoadMultisigs
  | LoadMultisigsSuccess
  | LoadMultisigsFailed