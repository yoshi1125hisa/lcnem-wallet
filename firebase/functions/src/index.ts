import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _deposit } from './deposit';
import { _withdraw } from './withdraw';
import { _rate } from './rate';
import { _chargePlan } from './charge-plan';
import { _faucet } from './faucet';

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

export const deposit: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "deposit")
    ? _deposit
    : null

export const withdraw: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdraw")
    ? _withdraw
    : null

export const rate: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "rate")
    ? _rate
    : null

export const chargePlan: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "chargePlan")
    ? _chargePlan
    : null
      
export const faucet: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "faucet")
    ? _faucet
    : null
      