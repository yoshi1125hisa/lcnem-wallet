import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  Address,
  TransferTransaction,
  TimeWindow,
  Account,
  XEM,
  TransactionHttp,
  EmptyMessage,
  AccountHttp
} from 'nem-library';
import { Wallet } from './models/wallet';
import { User } from './models/user';

export const _faucet = functions.https.onRequest(
  async (req, res) => {
    try {
      const userId = req.body.userId as string
      const walletId = req.body.walletId as string

      if (!userId || !walletId) {
        throw Error()
      }

      const userDoc = await admin.firestore().collection("users").doc(userId).get()
      const walletDoc = await admin.firestore().collection("users").doc(userId).collection("wallets").doc(walletId).get()

      if (!walletDoc.exists) {
        throw Error()
      }
      const user = userDoc.data() as User
      if (user.faucetDate) {
        const faucetDate = new Date(user.faucetDate)
        faucetDate.setDate(faucetDate.getDate() + 1)
        if (faucetDate > new Date()) {
          throw Error()
        }
      }
      await admin.firestore().collection("users").doc(userId).set(
        {
          ...user,
          faucetDate: (new Date()).toUTCString()
        } as User,
      )

      const address = new Address((walletDoc.data() as Wallet).nem)

      const assets = await new AccountHttp().getAssetsOwnedByAddress(address).toPromise()
      const xem = assets.find(asset => asset.assetId.toString() === "nem:xem")
      if (!xem || xem.quantity > 1000000) {
        throw Error()
      }

      const account = Account.createWithPrivateKey(functions.config().nem.private_key)
      const signed = account.signTransaction(
        TransferTransaction.create(
          TimeWindow.createWithDeadline(),
          address,
          new XEM(1),
          EmptyMessage
        )
      )
      await new TransactionHttp().announceTransaction(signed).toPromise()

      res.status(200).send()
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)