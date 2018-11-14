import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Contact } from './contact.model';

export enum ContactActionTypes {
  LoadContacts = '[Contact] Load Contacts',
  LoadContactsSuccess = '[Contact] Load Contacts Success',
  LoadContactsFailed = '[Contact] Load Contacts Failed',
  AddContact = '[Contact] Add Contact',
  AddContactSuccess = '[Contact] Add Contact Success',
  AddContactFailed = '[Contact] Add Contact Failed',
  UpsertContact = '[Contact] Upsert Contact',
  AddContacts = '[Contact] Add Contacts',
  UpsertContacts = '[Contact] Upsert Contacts',
  UpdateContact = '[Contact] Update Contact',
  UpdateContactSuccess = '[Contact] Update Contact Success',
  UpdateContactFailed = '[Contact] Update Contact Failed',
  UpdateContacts = '[Contact] Update Contacts',
  DeleteContact = '[Contact] Delete Contact',
  DeleteContactSuccess = '[Contact] Delete Contact Success',
  DeleteContactFailed = '[Contact] Delete Contact Failed',
  DeleteContacts = '[Contact] Delete Contacts',
  ClearContacts = '[Contact] Clear Contacts',
}


export class LoadContacts implements Action {
  readonly type = ContactActionTypes.LoadContacts;

  constructor(public payload?: { contacts: Contact[] }) { }
}

export class LoadContactsSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactsSuccess;
  constructor() { }
}

export class LoadContactsFailed implements Action {
  readonly type = ContactActionTypes.LoadContactsFailed;
  constructor() { }
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;

  constructor(public payload: { contact: Contact }) { }
}

export class AddContactSuccess implements Action {
  readonly type = ContactActionTypes.AddContactSuccess;

  constructor() { }
}

export class AddContactFailed implements Action {
  readonly type = ContactActionTypes.AddContactFailed;

  constructor() { }
}

export class UpsertContact implements Action {
  readonly type = ContactActionTypes.UpsertContact;

  constructor(public payload: { contact: Contact }) { }
}

export class AddContacts implements Action {
  readonly type = ContactActionTypes.AddContacts;

  constructor(public payload: { contacts: Contact[] }) { }
}

export class UpsertContacts implements Action {
  readonly type = ContactActionTypes.UpsertContacts;

  constructor(public payload: { contacts: Contact[] }) { }
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;

  constructor(public payload: {
    id: string,
    data: Contact
  }) { }
}

export class UpdateContactSuccess implements Action {
  readonly type = ContactActionTypes.UpdateContactSuccess;

  constructor() { }
}

export class UpdateContactFailed implements Action {
  readonly type = ContactActionTypes.UpdateContactFailed;

  constructor() { }
}

export class UpdateContacts implements Action {
  readonly type = ContactActionTypes.UpdateContacts;

  constructor(public payload: { contacts: Update<Contact>[] }) { }
}

export class DeleteContact implements Action {
  readonly type = ContactActionTypes.DeleteContact;

  constructor(public payload: { id: string }) { }
}

export class DeleteContactSuccess implements Action {
  readonly type = ContactActionTypes.DeleteContactSuccess;

  constructor() { }
}

export class DeleteContactFailed implements Action {
  readonly type = ContactActionTypes.DeleteContactFailed;

  constructor() { }
}

export class DeleteContacts implements Action {
  readonly type = ContactActionTypes.DeleteContacts;

  constructor(public payload: { ids: string[] }) { }
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
