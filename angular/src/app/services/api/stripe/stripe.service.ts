import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatCalendarBody } from '@angular/material';
import { doesNotReject } from 'assert';
import { stripeCharge, supportedInstruments } from '../../../../stripe'

declare const stripe: any;
declare const elements: any;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { ; console.log("stripe") }

  public charge() {

    var form: any = document.getElementById('payment-form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      stripe.createToken(card).then(function (result) {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          stripeTokenHandler(result.token);
        }
      });
    });

    function stripeTokenHandler(token) {
      var form = document.getElementById('payment-form');
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'stripeToken');
      hiddenInput.setAttribute('value', token.id);
      form.appendChild(hiddenInput);

      form.submit();
    }

    var stripe = require("stripe")("sk_test_6obhPUDZ2BkjAXTOjZbwoa8e");

    stripe.products.create({
      name: 'lcnem-wallet',
      type: 'service',
    }, function (err, product) {
      // asynchronously called
    });

    stripe.plans.create({
      currency: 'jpy',
      interval: 'month',
      product: '{{PRODUCT_ID}', //Product IDを指定
      nickname: 'Standard',
      amount: 200,
    }, function (err, plan) {
      // asynchronously called
    });

    let customer = stripe.Customer.create({
      email: body.email,
      description: body.description
        source: body.stripeToken.id
    }), (err, customer) => {

      if (!err && customer) {
        stripe.subscriptions.create({
          customer: customer.id,
          trial_end: new Date("2019-01-01T00:00:00").getTime() / 1000,
          plan: "プランID"
        }, (err, subscription) => {
          if (!err && subscription) {
            return done(null, { "my_msg": "OK" });
          } else {
            return doesNotReject(null, { "message": JSON.stringify(err, null, 2) });
          }
        });
      } else {
        return done(null, {
          "message:" JSON.stringify(err, null, 2)
        });
      }
    }
  }
}
}
