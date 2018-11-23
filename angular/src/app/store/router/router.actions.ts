import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export enum RouterActionTypes {
  Navigate = '[Router] Navigate',
  NavigateSuccess = '[Router] Navigate Success',
  NavigateFailed = '[Router] Navigate Failed',
  Back = '[Router] Back'
}

export class Navigate implements Action {
  readonly type = RouterActionTypes.Navigate;

  constructor(
    public payload: {
      commands: any[];
      extras?: NavigationExtras
    }
  ) {}
}

export class NavigateSuccess implements Action {
  readonly type = RouterActionTypes.NavigateSuccess;
}

export class NavigateFailed implements Action {
  readonly type = RouterActionTypes.NavigateFailed;

  constructor(
    public payload: {
      error: Error
    }
  ) {}
}

export class Back implements Action {
  readonly type = RouterActionTypes.Back;

  constructor(
    public payload: {
      commands: any[];
      extras?: NavigationExtras
    }
  ) {}
}

export type RouterActions = Navigate
  | NavigateSuccess
  | NavigateFailed
  | Back;
