import { Action } from '@ngrx/store';

export enum StripeActionTypes {
  StripeCharge = '[Stripe] Charge',
  StripeChargeSuccess = '[Stripe] Charge Success',
  StripeChargeFailed = '[Stripe] Charge Failed',
}

export class StripeCharge implements Action {
  readonly type = StripeActionTypes.StripeCharge;

  constructor(
    public payload: {
      result: PaymentResponse;
      callback: (
        status: any,
        response: any
      ) => any
    }
  ) { }
}

export class StripeChargeSuccess implements Action {
  readonly type = StripeActionTypes.StripeChargeSuccess;

  constructor(
    public payload: {}
  ) { }
}

export class StripeChargeFailed implements Action {
  readonly type = StripeActionTypes.StripeChargeFailed;

  constructor(
    error: Error;
  ) { }
}

export type StripeActions =
  StripeCharge
  | StripeChargeSuccess
  | StripeChargeFailed;