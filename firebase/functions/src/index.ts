import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _orderCheque } from './cheque/order-cheque';
import { _orderLightningInvoice } from './cheque/order-lightning-invoice';
import { _orderCash } from './cheque/order-cash';
import { _changePlan } from './change-plan';
import { _faucet } from './faucet';
import { _rate } from './rate';
import { _refreshAccessToken } from './integration/refresh-access-token';
import { _sign } from './integration/sign';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(functions.config().service_account).replace(/\\\\n/g, "\\n"))),
  databaseURL: "https://lcnem-wallet.firebaseio.com"
})

export const orderCheque: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "orderCheque")
    ? _orderCheque
    : null

export const orderLightningInvoice: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "orderLightningInvoice")
    ? _orderLightningInvoice
    : null
    
export const orderCash: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "orderCash")
    ? _orderCash
    : null

export const changePlan: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "changePlan")
    ? _changePlan
    : null
      
export const faucet: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "faucet")
    ? _faucet
    : null

export const rate: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "rate")
    ? _rate
    : null

export const refreshAccessToken: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "refreshAccessToken")
    ? _refreshAccessToken
    : null

export const sign: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "sign")
    ? _sign
    : null
