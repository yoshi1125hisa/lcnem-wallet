import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }

  public charge(
    paymentResponse: PaymentResponse
  ) {
    const subject = new Subject<{
      status: any,
      response: any
    }>();
    Stripe.setPublishableKey(environment.stripe.pk);
    Stripe.card.createToken(
      {
        number: paymentResponse.details.cardNumber,
        cvc: paymentResponse.details.cardSecurityCode,
        exp_month: paymentResponse.details.expiryMonth,
        exp_year: paymentResponse.details.expiryYear
      },
      (status: any, response: any) => {
        subject.next({
          status: status,
          response: response
        })
        subject.complete()
      }
    );

    return subject.asObservable
  }
}

declare const Stripe: any;