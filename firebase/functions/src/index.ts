import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _depositRequest } from './deposit-request';
import { _depositByLightningBtc } from './deposit-by-lightning-btc';
import { _withdrawRequest } from './withdraw-request';
import { _chargePlan } from './charge-plan';
import { _faucet } from './faucet';
import { _rate } from './rate';

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

export const depositRequest: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "depositRequest")
    ? _depositRequest
    : null


export const depositByLightningBtc: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "depositRequest")
    ? _depositByLightningBtc
    : null

      
export const withdrawRequest: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdrawRequest")
    ? _withdrawRequest
    : null

export const chargePlan: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "chargePlan")
    ? _chargePlan
    : null
      
export const faucet: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "faucet")
    ? _faucet
    : null

export const rate: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "rate")
    ? _rate
    : null
