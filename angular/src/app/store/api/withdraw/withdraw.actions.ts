import { Action } from '@ngrx/store';

export enum WithdrawRequestActionTypes {
  SendWithdrawRequest = '[SendWithdrawRequest] Send Withdraw Request',
  SendWithdrawRequestSuccess = '[SendWithdrawRequest] Send Withdraw Request Success',
  SendWithdrawRequestFailed = '[SendWithdrawRequest] Send Withdraw Request Failed'
}

export class SendWithdrawRequest implements Action {
  readonly type = WithdrawRequestActionTypes.SendWithdrawRequest;

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

 export class SendWithdrawRequestSuccess implements Action {
  readonly type = WithdrawRequestActionTypes.SendWithdrawRequest;
}

 export class SendWithdrawRequestFailed implements Action {
  readonly type = WithdrawRequestActionTypes.SendWithdrawRequest;
  constructor(
    public payload: {
      error: Error;
    }
  ) { }
}

 export type WithdrawRequestActions =
 SendWithdrawRequest
  | SendWithdrawRequestSuccess
  | SendWithdrawRequestFailed