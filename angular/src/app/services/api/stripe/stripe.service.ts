import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';

declare const Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
  ) { }

  public async charge() {
    Stripe.setPublishableKey(environment.stripe.pk);

    const uid = this.auth.user!.uid;

    const supportedInstruments = [
      {
        supportedMethods: ['basic-card'],
        data: {
          supportedNetworks: [
            'visa',
            'mastercard'
          ]
        }
      }
    ]

    let details = {
      displayItems: [
        {
          label: 'LCNEM Wallet Standard Plan Fee Per Month',
          amount: { currency: 'JPY', value: '200' }
        }
      ],
      total: {
        label: 'LCNEM Wallet Standard Plan Total Fee Per Month',
        amount: { currency: 'JPY', value: '200' }
      }
    }

    const request = new PaymentRequest(supportedInstruments, details, { requestShipping: false });

    const result = await request.show();
    if (!result) {
      return;
    }

    const token: any = Stripe.card.createToken(
        {
        number: result.details.cardNumber,
        cvc: result.details.cardSecurityCode,
        exp_month: result.details.expiryMonth,
        exp_year: result.details.expiryYear
      }
    )

    Stripe.Customer.create(
      {
        email: this.auth.user!.email,
        source: token,
        id: uid,
      },
      (err: any, customer: any) => {
        if (!err && customer) {
          Stripe.subscriptions.create(
            {
              customer: customer.id,
              trial_end: this.getFirstDayOfNextMonth().getTime() / 1000,
              items: [{ plan: "plan_EFWnnrtQXB3tR6" }]
            },
            (err: any, subscription: any) => {
              if (!err && subscription) {
                this.firestore.collection("users").doc(uid).set({
                  plan: "Standard",
                  subscription_id: subscription.id
                }, { merge: true });
                return JSON.stringify({ message: "OK" });
              } else {
                return JSON.stringify({ message: err });
              }
            }
          )
        } else {
          return JSON.stringify({ message: err });
        }
      }
    )
  }

  private getFirstDayOfNextMonth(): Date {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);

    return date;
  }
}