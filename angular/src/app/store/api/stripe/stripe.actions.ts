import { Action } from '@ngrx/store';

export enum StripeActionTypes {
  LoadStripes = '[Stripe] Load Stripes'
}

export class LoadStripes implements Action {
  readonly type = StripeActionTypes.LoadStripes;
}

export type StripeActions = LoadStripes;
