import { Action } from '@ngrx/store';

export enum MultisigActionTypes {
  ReadMultisigs = '[Multisig] Read Multisigs'
}

export class ReadMultisigs implements Action {
  readonly type = MultisigActionTypes.ReadMultisigs;
}

export type MultisigActions = ReadMultisigs;
