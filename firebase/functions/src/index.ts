import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _onCreate } from './on-create';
import { _deposit } from './deposit';
import { _withdraw } from './withdraw';
import { _payPlan } from './pay-plan';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(functions.config().service_account).replace(/\\\\n/g, "\\n"))),
  databaseURL: "https://ticket-p2p.firebaseio.com"
});

export const onCreate = _onCreate;
export let deposit: functions.HttpsFunction;
export let withdraw: functions.HttpsFunction;
export let payPlan: functions.HttpsFunction;

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "deposit") {
  deposit = _deposit;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdraw") {
  withdraw = _withdraw;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "payPlan") {
  payPlan = _payPlan;
}
