import { Action } from '@ngrx/store';
import { User } from '../../../../../firebase/functions/src/models/user';

export enum UserActionTypes {
  LoadUser = 'LoadUser',
  LoadUserSuccess = 'LoadUserSuccess',
  LoadUserError = 'LoadUserError'
}

export class LoadUser implements Action {
  readonly type = UserActionTypes.LoadUser;

  constructor(public payload: { userId: string, refresh?: boolean }) {}
}

export class LoadUserSuccess implements Action {
  readonly type = UserActionTypes.LoadUserSuccess;

  constructor(public payload: { user: User }) {}
}

export class LoadUserError implements Action {
  readonly type = UserActionTypes.LoadUserError;

  constructor(public payload: { error: Error }) {}
}


export type UserActions = LoadUser | LoadUserSuccess | LoadUserError;
