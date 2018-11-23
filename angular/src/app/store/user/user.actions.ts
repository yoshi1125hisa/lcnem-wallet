import { Action } from '@ngrx/store';
import { User } from '../../../../../firebase/functions/src/models/user';

export enum UserActionTypes {
  LoginGoogle = '[User] Login Google',
  LoginGoogleSuccess = '[User] Login Google Success',
  LoginGoogleFailed = '[User] Login Google Failed',
  Logout = '[User] Logout',
  LoadUser = '[User] Load',
  LoadUserSuccess = '[User] Load Success',
  LoadUserFailed = '[User] Load Failed'
}

export class LoginGoogle implements Action {
  readonly type = UserActionTypes.LoginGoogle;

  constructor(
    public payload: {}
  ) { }
}

export class LoginGoogleSuccess implements Action {
  readonly type = UserActionTypes.LoginGoogleSuccess;

  constructor(
    public payload: {}
  ) { }
}

export class LoginGoogleFailed implements Action {
  readonly type = UserActionTypes.LoginGoogleFailed;

  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

export class Logout implements Action {
  readonly type = UserActionTypes.Logout;
}

export class LoadUser implements Action {
  readonly type = UserActionTypes.LoadUser;

  constructor(
    public payload: {
      userId: string;
    }
  ) { }
}

export class LoadUserSuccess implements Action {
  readonly type = UserActionTypes.LoadUserSuccess;

  constructor(
    public payload: {
      user: User;
    }
  ) { }
}

export class LoadUserFailed implements Action {
  readonly type = UserActionTypes.LoadUserFailed;

  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

export type UserActions =
  LoginGoogle
  | LoginGoogleSuccess
  | LoginGoogleFailed
  | LoadUser
  | LoadUserSuccess
  | LoadUserFailed;