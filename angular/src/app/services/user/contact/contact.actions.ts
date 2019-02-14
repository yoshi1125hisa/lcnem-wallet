import { Action } from '@ngrx/store';

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
}

export class LoadContactsSuccess implements Action {
  readonly type = ContactActionTypes.LoadContactsSuccess;
}

export class LoadContactsError implements Action {
  readonly type = ContactActionTypes.LoadContactsError;
}

export class AddContact implements Action {
  readonly type = ContactActionTypes.AddContact;
}

export class AddContactSuccess implements Action {
  readonly type = ContactActionTypes.AddContactSuccess;
}

export class AddContactError implements Action {
  readonly type = ContactActionTypes.AddContactError;
}

export class UpdateContact implements Action {
  readonly type = ContactActionTypes.UpdateContact;
}

export class UpdateContactSuccess implements Action {
  readonly type = ContactActionTypes.UpdateContactSuccess;
}

export class UpdateContactError implements Action {
  readonly type = ContactActionTypes.UpdateContactError;
}

export class DeleteContact implements Action {
  readonly type = ContactActionTypes.DeleteContact;
}

export class DeleteContactSuccess implements Action {
  readonly type = ContactActionTypes.DeleteContactSuccess;
}

export class DeleteContactError implements Action {
  readonly type = ContactActionTypes.DeleteContactError;
}


export type ContactActions = LoadContacts | LoadContactsSuccess | LoadContactsError | AddContact | AddContactSuccess | AddContactError | UpdateContact | UpdateContactSuccess | UpdateContactError | DeleteContact | DeleteContactSuccess | DeleteContactError;
