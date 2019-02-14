import { Action } from '@ngrx/store';

export enum MultisigActionTypes {
  LoadMultisigs = '[Multisig] Load Multisigs',
  
  
}

export class LoadMultisigs implements Action {
  readonly type = MultisigActionTypes.LoadMultisigs;
}


export type MultisigActions = LoadMultisigs;
