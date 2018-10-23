import * as functions from 'firebase-functions';
import { Wallet } from '../../../models/wallet';

import {
  Account,
  TransactionHttp,
  TransferTransaction,
  PlainMessage,
  TimeWindow,
  XEM,
  NEMLibrary,
  NetworkTypes,
  Address,
} from 'nem-library';

export const onCreate = functions.firestore.document("users/{user}/wallets/{wallet}").onCreate(async event => {
  try {
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
  } catch {}
  
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
