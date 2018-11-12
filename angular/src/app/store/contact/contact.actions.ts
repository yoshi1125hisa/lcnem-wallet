import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Contact } from './contact.model';

export enum ContactActionTypes {
  LoadContacts = '[Contact] Load Contacts',
  AddContact = '[Contact] Add Contact',
  UpsertContact = '[Contact] Upsert Contact',
  AddContacts = '[Contact] Add Contacts',
  UpsertContacts = '[Contact] Upsert Contacts',
  UpdateContact = '[Contact] Update Contact',
  UpdateContacts = '[Contact] Update Contacts',
  DeleteContact = '[Contact] Delete Contact',
  DeleteContacts = '[Contact] Delete Contacts',
  ClearContacts = '[Contact] Clear Contacts'
}

export class LoadContacts implements Action {
  readonly type = ContactActionTypes.LoadContacts;

  constructor(public payload: { contacts: Contact[] }) {}
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;

  constructor(public payload: { contact: Contact }) {}
}

export class UpsertContact implements Action {
  readonly type = ContactActionTypes.UpsertContact;

  constructor(public payload: { contact: Contact }) {}
}

export class AddContacts implements Action {
  readonly type = ContactActionTypes.AddContacts;

  constructor(public payload: { contacts: Contact[] }) {}
}

export class UpsertContacts implements Action {
  readonly type = ContactActionTypes.UpsertContacts;

  constructor(public payload: { contacts: Contact[] }) {}
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;

  constructor(public payload: { contact: Update<Contact> }) {}
}

export class UpdateContacts implements Action {
  readonly type = ContactActionTypes.UpdateContacts;

  constructor(public payload: { contacts: Update<Contact>[] }) {}
}

export class DeleteContact implements Action {
  readonly type = ContactActionTypes.DeleteContact;

  constructor(public payload: { id: string }) {}
}

export class DeleteContacts implements Action {
  readonly type = ContactActionTypes.DeleteContacts;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearContacts implements Action {
  readonly type = ContactActionTypes.ClearContacts;
}

export type ContactActions =
 LoadContacts
 | AddContact
 | UpsertContact
 | AddContacts
 | UpsertContacts
 | UpdateContact
 | UpdateContacts
 | DeleteContact
 | DeleteContacts
 | ClearContacts;
