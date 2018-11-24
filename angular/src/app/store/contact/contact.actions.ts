import { Action } from '@ngrx/store';
import { Contact } from './contact.model';
import { Dictionary } from '@ngrx/entity';

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

  constructor(
    public payload: {
      userId: string;
    }
  ) { }
}

export class LoadContactsSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactsSuccess;
  constructor(
    public payload: {
      contacts: Dictionary<Contact>;
    }
  ) { }
}

export class LoadContactsFailed implements Action {
  readonly type = ContactActionTypes.LoadContactsFailed;
  constructor(
    public error: Error
  ) { }
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;

  constructor(
    public payload: {
      userId: string;
      contact: Contact;
    }
  ) { }
}

export class AddContactSuccess implements Action {
  readonly type = ContactActionTypes.AddContactSuccess;

  constructor(
    public payload: {
      id: string;
      contact: Contact;
    }
  ) { }
}

export class AddContactFailed implements Action {
  readonly type = ContactActionTypes.AddContactFailed;

  constructor(
    error: Error
  ) { }
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;

  constructor(
    public payload: {
      userId: string;
      id: string;
      contact: Contact;
    }
  ) { }
}

export class UpdateContactSuccess implements Action {
  readonly type = ContactActionTypes.UpdateContactSuccess;

  constructor(
    public payload: {
      id: string;
      contact: Contact;
    }
  ) { }
}

export class UpdateContactFailed implements Action {
  readonly type = ContactActionTypes.UpdateContactFailed;

  constructor(
    error: Error
  ) { }
}

export class DeleteContacts implements Action {
  readonly type = ContactActionTypes.DeleteContacts;

  constructor(
    public payload: {
      userId: string;
      ids: string[];
    }
  ) { }
}

export class DeleteContactsSuccess implements Action {
  readonly type = ContactActionTypes.DeleteContactsSuccess;

  constructor(
    public payload: {
      ids: string[];
    }
  ) { }
}

export class DeleteContactsFailed implements Action {
  readonly type = ContactActionTypes.DeleteContactsFailed;

  constructor(
    error: Error
  ) { }
}

export type ContactActions =
  LoadContacts
  | LoadContactsSuccess
  | LoadContactsFailed
  | AddContact
  | AddContactSuccess
  | AddContactFailed
  | UpdateContact
  | UpdateContactSuccess
  | UpdateContactFailed
  | DeleteContacts
  | DeleteContactsSuccess
  | DeleteContactsFailed

