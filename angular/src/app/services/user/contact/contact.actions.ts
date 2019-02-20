import { Action } from '@ngrx/store';
import { Contact } from '../../../../../../firebase/functions/src/models/contact';

export enum ContactActionTypes {
  LoadContacts = 'LoadContacts',
  LoadContactsSuccess = 'LoadContactsSuccess',
  LoadContactsError = 'LoadContactsError',
  AddContact = 'AddContact',
  AddContactSuccess = 'AddContactSuccess',
  AddContactError = 'AddContactError',
  UpdateContact = 'UpdateContact',
  UpdateContactSuccess = 'UpdateContactSuccess',
  UpdateContactError = 'UpdateContactError',
  DeleteContact = 'DeleteContact',
  DeleteContactSuccess = 'DeleteContactSuccess',
  DeleteContactError = 'DeleteContactError'
}

export class LoadContacts implements Action {
  readonly type = ContactActionTypes.LoadContacts;

  constructor(public payload: { userId: string, refresh?: boolean }) { }
}

export class LoadContactsSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactsSuccess;

  constructor(public payload: { userId: string, ids: string[], entities: { [id: string]: Contact } }) { }
}

export class LoadContactsError implements Action {
  readonly type = ContactActionTypes.LoadContactsError;

  constructor(public payload: { error: Error }) { }
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;

  constructor(public payload: { userId: string, contact: Contact }) { }
}

export class AddContactSuccess implements Action {
  readonly type = ContactActionTypes.AddContactSuccess;

  constructor(public payload: { contactId: string, contact: Contact }) { }
}

export class AddContactError implements Action {
  readonly type = ContactActionTypes.AddContactError;

  constructor(public payload: { error: Error }) { }
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;

  constructor(public payload: { userId: string, contactId: string, contact: Contact }) { }
}

export class UpdateContactSuccess implements Action {
  readonly type = ContactActionTypes.UpdateContactSuccess;

  constructor(public payload: { contactId: string, contact: Contact }) { }
}

export class UpdateContactError implements Action {
  readonly type = ContactActionTypes.UpdateContactError;

  constructor(public payload: { error: Error }) { }
}

export class DeleteContact implements Action {
  readonly type = ContactActionTypes.DeleteContact;

  constructor(public payload: { userId: string, contactId: string }) { }
}

export class DeleteContactSuccess implements Action {
  readonly type = ContactActionTypes.DeleteContactSuccess;

  constructor(public payload: { contactId: string }) { }
}

export class DeleteContactError implements Action {
  readonly type = ContactActionTypes.DeleteContactError;

  constructor(public payload: { error: Error }) { }
}



export type ContactActions = LoadContacts | LoadContactsSuccess | LoadContactsError | AddContact | AddContactSuccess | AddContactError | UpdateContact | UpdateContactSuccess | UpdateContactError | DeleteContact | DeleteContactSuccess | DeleteContactError;
