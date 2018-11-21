import { Action } from '@ngrx/store';

export enum UserActionTypes {
  LoginGoogle = '[User] Login Google',
  LoginGoogleSuccess = '[User] Login Google Success',
  LoginGoogleFailed = '[User] Login Google Failed',
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

export class LoadUser implements Action {
  readonly type = UserActionTypes.LoadUser;

  constructor(
    public payload: {}
  ) { }
}

export class LoadUserSuccess implements Action {
  readonly type = UserActionTypes.LoadUserSuccess;

  constructor(
    public payload: {}
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