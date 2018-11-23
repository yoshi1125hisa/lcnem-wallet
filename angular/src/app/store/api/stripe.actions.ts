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
    public payload: {}
  ) { }
}

export type StripeActions =
  StripeCharge
  | StripeChargeSuccess
  | StripeChargeFailed;