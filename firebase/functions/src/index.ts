import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _changePlan } from './change-plan';
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
