import { Action } from '@ngrx/store';

export enum ContactActionTypes {
  CreateContact = '[Contact] Create Contact',
  ReadContacts = '[Contact] Read Contacts',
  UpdateContact = '[Contact] Update Contact',
  DeleteContact = '[Contact] Delete Contact'
}

export class CreateContacts implements Action {
  readonly type = ContactActionTypes.CreateContact;
}

export class ReadContacts implements Action {
  readonly type = ContactActionTypes.ReadContacts;
}

export class UpdateContacts implements Action {
  readonly type = ContactActionTypes.UpdateContact;
}

export class DeleteContacts implements Action {
  readonly type = ContactActionTypes.DeleteContact;
}

export type ContactActions = CreateContacts | ReadContacts | UpdateContacts | DeleteContacts;
