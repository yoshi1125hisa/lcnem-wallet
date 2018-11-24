import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StripeActionTypes, StripeCharge, StripeChargeComplete } from './stripe.actions';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { State } from '../..';


declare let Stripe: any;

@Injectable()
export class StripeEffects {

  constructor(
    private store: Store<State>,
    private actions$: Actions
  ) { }

  @Effect({ dispatch: false }) stripeCharge$ = this.actions$.pipe(
    ofType<StripeCharge>(StripeActionTypes.StripeCharge),
    map(
      action => {
        Stripe.setPublishableKey(environment.stripe.pk);
        Stripe.card.createToken(
          {
            number: action.payload.paymentResponse.details.cardNumber,
            cvc: action.payload.paymentResponse.details.cardSecurityCode,
            exp_month: action.payload.paymentResponse.details.expiryMonth,
            exp_year: action.payload.paymentResponse.details.expiryYear
          },
          (status: any, response: any) => {
            this.store.dispatch(new StripeChargeComplete({
              status: status,
              response: response
            }))
          }
        );
      }
    )
  )
}
