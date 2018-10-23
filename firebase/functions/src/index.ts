import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  Account,
  SimpleWallet,
  TransactionHttp,
  TransferTransaction,
  PlainMessage,
  TimeWindow,
  XEM,
  NEMLibrary,
  NetworkTypes,
  Password,
  Address,
} from 'nem-library';
import * as request from 'request';
import { Contact } from '../../../models/contact';
import { User } from '../../../models/user';
import { Wallet } from '../../../models/wallet';

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

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

export const onCreate = functions.firestore.document("users/{user}/wallets/{wallet}").onCreate(async event => {
  try {
    const doc = await event.ref.get();
    const account = Account.createWithPrivateKey(functions.config().nem.private_key);
    const signed = account.signTransaction(TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address((doc.data()! as Wallet).nem),
      new XEM(1),
      PlainMessage.create("Thanks! LCNEM")
    ))
    await new TransactionHttp().announceTransaction(signed).toPromise();
  } catch {
  }
});

export const depositV1 = functions.https.onRequest((req, res) => {
  try {
    const email = req.body.email as string;
    const nem = req.body.nem as string;
    const currency = req.body.currency as string;
    const amount = req.body.amount as number;
    const method = req.body.method as string;
    const lang = req.body.lang as string;

    if (!email || !nem || !currency || !amount || !method || !lang) {
      throw Error();
    }

    request.post(
      functions.config().gas.deposit,
      {
        form: {
          email: email,
          nem: nem,
          currency: currency,
          amount: amount,
          method: method,
          lang: lang
        }
      },
      () => {
        res.status(200).send();
      }
    );
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export const withdrawV1 = functions.https.onRequest((req, res) => {
  try {
    const email = req.body.email as string;
    const nem = req.body.nem as string;
    const currency = req.body.currency as string;
    const amount = req.body.amount as number;
    const method = req.body.method as string;
    const lang = req.body.lang as string; console.log([email, nem, currency, amount, method, lang])

    if (!email || !nem || !currency || !amount || !method || !lang) {
      throw Error();
    }

    request.post(
      functions.config().gas.withdraw,
      {
        form: {
          email: email,
          nem: nem,
          currency: currency,
          amount: amount,
          method: method,
          lang: lang
        }
      },
      () => {
        res.status(200).send();
      }
    );
  } catch (e) {
    res.status(400).send(e.message);
  }
})

const payPlanV1 = functions.https.onRequest(async (req, res) => {
  try {
    const plan = req.body.plan as string;
    const signedTransaction = req.body.signedTransaction as string;

    if(!plan || !signedTransaction) {
      throw Error("INVALID_PARAMETERS");
    }

    if(plan != "Standard") {
      throw Error("INVALID_PLAN");
    }
  } catch(e) {
    res.status(400).send(e.message);
  }
});
