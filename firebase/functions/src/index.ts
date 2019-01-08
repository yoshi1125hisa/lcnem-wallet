import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { _deposit } from './deposit';
import { _withdraw } from './withdraw';

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

export const deposit: functions.HttpsFunction
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "deposit")
    ? _deposit
    : null

export const withdraw: functions.HttpsFunction
  = (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "withdraw")
    ? _withdraw
    : null

/*
 const account = Account.createWithPrivateKey(functions.config().nem.private_key);
    const signed = account.signTransaction(TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address((doc.data() as Wallet).nem),
      new XEM(1),
      PlainMessage.create("Thanks! LCNEM")
    ));
    await new TransactionHttp().announceTransaction(signed).toPromise();
*/