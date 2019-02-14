import { Action } from '@ngrx/store';

export enum ContactActionTypes {
  LoadContacts = '[Contact] Load Contacts',
  
  
}

export class LoadContacts implements Action {
  readonly type = ContactActionTypes.LoadContacts;
}


export type ContactActions = LoadContacts;
