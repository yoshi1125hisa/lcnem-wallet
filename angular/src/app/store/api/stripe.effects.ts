import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { environment } from "../../../environments/environment";
import { stripeCharge } from 'src/app/models/stripe';
import { StripeActionTypes, StripeCharge, StripeChargeSuccess, StripeChargeFailed } from './stripe.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

declare let Stripe: any;

@Injectable()
export class StripeEffects {

  constructor(
    private actions$: Actions
  ) {
  }

  @Effect() stripeCharge$ = this.actions$.pipe(
    ofType<StripeCharge>(StripeActionTypes.StripeCharge),
    mergeMap(
      action => Stripe.card.createToken({
        number: action.payload.result.details.cardNumber,
        cvc: action.payload.result.details.cardSecurityCode,
        exp_month: action.payload.result.details.expiryMonth,
        exp_year: action.payload.result.details.expiryYear
      }, action.payload.callback).pipe(
        map(data => new StripeChargeSuccess({})),
        catchError(e => of(new StripeChargeFailed(e)))
      )
    )
  )
}
