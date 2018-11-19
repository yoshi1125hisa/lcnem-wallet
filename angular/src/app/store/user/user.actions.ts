import { Action } from '@ngrx/store';

export enum UserActionTypes {
  LoginGoogle = '[User] Login Google',
  LoginGoogleSuccess = '[User] Login Google Success',
  LoginGoogleFailed = '[User] Login Google Failed'  
}

export class LoginGoogle implements Action {
  readonly type = UserActionTypes.LoginGoogle;

  constructor(
    public payload: { }
  ) {}
}

export class LoginGoogleSuccess implements Action {
  readonly type = UserActionTypes.LoginGoogleSuccess;

  constructor(
    public payload: {   }
  ) {}
}

export class LoginGoogleFailed implements Action {
  readonly type = UserActionTypes.LoginGoogleFailed;

  constructor(
    public payload: {   }
  ) {}
}

export type UserActions =
 LoginGoogle
 | LoginGoogleSuccess
 | LoginGoogleFailed;