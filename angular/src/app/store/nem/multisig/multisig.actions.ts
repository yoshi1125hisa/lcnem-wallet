import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Multisig } from './multisig.model';

export enum MultisigActionTypes {
  LoadMultisigs = '[Multisig] Load Multisigs',
  AddMultisig = '[Multisig] Add Multisig',
  UpsertMultisig = '[Multisig] Upsert Multisig',
  AddMultisigs = '[Multisig] Add Multisigs',
  UpsertMultisigs = '[Multisig] Upsert Multisigs',
  UpdateMultisig = '[Multisig] Update Multisig',
  UpdateMultisigs = '[Multisig] Update Multisigs',
  DeleteMultisig = '[Multisig] Delete Multisig',
  DeleteMultisigs = '[Multisig] Delete Multisigs',
  ClearMultisigs = '[Multisig] Clear Multisigs'
}

export class LoadMultisigs implements Action {
  readonly type = MultisigActionTypes.LoadMultisigs;

  constructor(public payload: { multisigs: Multisig[] }) {}
}

export class AddMultisig implements Action {
  readonly type = MultisigActionTypes.AddMultisig;

  constructor(public payload: { multisig: Multisig }) {}
}

export class UpsertMultisig implements Action {
  readonly type = MultisigActionTypes.UpsertMultisig;

  constructor(public payload: { multisig: Multisig }) {}
}

export class AddMultisigs implements Action {
  readonly type = MultisigActionTypes.AddMultisigs;

  constructor(public payload: { multisigs: Multisig[] }) {}
}

export class UpsertMultisigs implements Action {
  readonly type = MultisigActionTypes.UpsertMultisigs;

  constructor(public payload: { multisigs: Multisig[] }) {}
}

export class UpdateMultisig implements Action {
  readonly type = MultisigActionTypes.UpdateMultisig;

  constructor(public payload: { multisig: Update<Multisig> }) {}
}

export class UpdateMultisigs implements Action {
  readonly type = MultisigActionTypes.UpdateMultisigs;

  constructor(public payload: { multisigs: Update<Multisig>[] }) {}
}

export class DeleteMultisig implements Action {
  readonly type = MultisigActionTypes.DeleteMultisig;

  constructor(public payload: { id: string }) {}
}

export class DeleteMultisigs implements Action {
  readonly type = MultisigActionTypes.DeleteMultisigs;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearMultisigs implements Action {
  readonly type = MultisigActionTypes.ClearMultisigs;
}

export type MultisigActions =
 LoadMultisigs
 | AddMultisig
 | UpsertMultisig
 | AddMultisigs
 | UpsertMultisigs
 | UpdateMultisig
 | UpdateMultisigs
 | DeleteMultisig
 | DeleteMultisigs
 | ClearMultisigs;
