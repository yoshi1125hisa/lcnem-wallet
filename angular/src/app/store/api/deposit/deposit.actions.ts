import { Action } from '@ngrx/store';

export enum DepositActionTypes {
  SendDepositRequest = '[Deposit] Load Deposits',
  SendDepositRequestSuccess = '[Deposit] Load Deposits Success',
  SendDepositRequestFailed = '[Deposit] Load Deposits Failed'
}

export class SendDepositRequest implements Action {
  readonly type = DepositActionTypes.SendDepositRequest;

  constructor(
    public payload: {
      email: string,
      nem: string,
      currency: string,
      amount: number,
      method: string,
      lang: string
    }
  ) { }
}

export class SendDepositRequestSuccess implements Action {
  readonly type = DepositActionTypes.SendDepositRequestSuccess;
}

export class SendDepositRequestFailed implements Action {
  readonly type = DepositActionTypes.SendDepositRequestFailed;

  constructor(
    public error: Error
  ) { }
}

export type DepositActions =
  SendDepositRequest
  | SendDepositRequestSuccess
  | SendDepositRequestFailed;
