import { Action } from '@ngrx/store';
import { Contact } from './contact.model';

export enum ContactActionTypes {
  LoadContacts = '[Contact] Load Contacts',
  LoadContactsSuccess = '[Contact] Load Contacts Success',
  LoadContactsFailed = '[Contact] Load Contacts Failed',
  AddContact = '[Contact] Add Contact',
  AddContactSuccess = '[Contact] Add Contact Success',
  AddContactFailed = '[Contact] Add Contact Failed',
  UpdateContact = '[Contact] Update Contact',
  UpdateContactSuccess = '[Contact] Update Contact Success',
  UpdateContactFailed = '[Contact] Update Contact Failed',
  DeleteContacts = '[Contact] Delete Contact',
  DeleteContactsSuccess = '[Contact] Delete Contact Success',
  DeleteContactsFailed = '[Contact] Delete Contact Failed',
}


export class LoadContacts implements Action {
  readonly type = ContactActionTypes.LoadContacts;

  constructor(public payload?: {
    contacts: Contact[]
  }) { }
}

export class LoadContactsSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactsSuccess;
  constructor(public payload?: {
    //あと回し
  }) { }
}

export class LoadContactsFailed implements Action {
  readonly type = ContactActionTypes.LoadContactsFailed;
  constructor() { }
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;

  constructor(public payload: {
    id: string;
    contact: Contact
  }) { }
}

export class AddContactSuccess implements Action {
  readonly type = ContactActionTypes.AddContactSuccess;

  constructor(public payload: {
    id: string;
    changes: Contact;
  }) { }
}

export class AddContactFailed implements Action {
  readonly type = ContactActionTypes.AddContactFailed;

  constructor() { }
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;

  constructor(public payload: {
    id: string,
    changes: Contact
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

export class DeleteContacts implements Action {
  readonly type = ContactActionTypes.DeleteContacts;

  constructor(public payload: { id: string }) { }
}

export class DeleteContactsSuccess implements Action {
  readonly type = ContactActionTypes.DeleteContactsSuccess;

  constructor() { }
}

export class DeleteContactsFailed implements Action {
  readonly type = ContactActionTypes.DeleteContactsFailed;

  constructor() { }
}

export type ContactActions =
  LoadContacts
  | LoadContactsSuccess
  | AddContact
  | AddContactSuccess
  | AddContactFailed
  | UpdateContact
  | DeleteContacts
  | DeleteContactsSuccess
  | DeleteContactsFailed

