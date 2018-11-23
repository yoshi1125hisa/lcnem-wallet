import { Action } from '@ngrx/store';

export enum ShareActionTypes {
  WebShareApi = '[Share] Web Share Api',
  CopyToClipboard = '[Share] Copy to Clipboard'
}

export class WebShareApi implements Action {
  readonly type = ShareActionTypes.WebShareApi;

  constructor(
    public payload: {
      title?: string;
      text?: string;
      url: string;
    }
  ) {}
}

export class CopyToClipboard implements Action {
  readonly type = ShareActionTypes.CopyToClipboard;

  constructor(
    public payload: {
      text: string;
    }
  ) {}
}

export type ShareActions =
  WebShareApi
  | CopyToClipboard;
