import { Action } from '@ngrx/store';

export enum StripeActionTypes {
  StripeCharge = '[Stripe] Charge',
  StripeChargeComplete = '[Stripe] Charge Complete'
}

export class StripeCharge implements Action {
  readonly type = StripeActionTypes.StripeCharge;

  constructor(
    public payload: {
      paymentResponse: PaymentResponse;
    }
  ) { }
}

export class StripeChargeComplete implements Action {
  readonly type = StripeActionTypes.StripeChargeComplete;

  constructor(
    public payload: {
      status: any;
      response: any;
    }
  ) { }
}

export type StripeActions =
  StripeCharge
  | StripeChargeComplete;
