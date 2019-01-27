import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _depositRequest } from './cheque/order';
import { _depositByLightningBtc } from './cheque/order-lightning';
import { _withdrawRequest } from './cheque/cash-order';
import { _changePlan } from './change-plan';
import { _faucet } from './faucet';
import { _rate } from './rate';
import { _refreshAccessToken } from './refresh-access-token';

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
      
export const withdrawRequest: functions.HttpsFunction | null
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdrawRequest")
    ? _withdrawRequest
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
