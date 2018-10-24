import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { onCreate } from './on-create';
import { deposit } from './deposit';
import { withdraw } from './withdraw';
import { payPlan } from './pay-plan';

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

exports.onCreate = onCreate;

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "deposit") {
  exports.deposit = deposit;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdraw") {
  exports.withdraw = withdraw;
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "payPlan") {
  exports.payPlan = payPlan;
}
