import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  Address,
  SimpleWallet,
  Password
} from 'nem-library'
import { Wallet } from '../models/wallet';

export const _sign = functions.https.onRequest(
  async (req, res) => {
    try {
      const data = req.body.data as string

      const authorization = req.headers.authorization || ""
      const bearer = authorization.substring(authorization.length - ("Bearer: ").length)

      if (!data || !bearer) {
        throw Error()
      }

      const [userId, walletId, integrationId] = bearer.split(":")

      const doc = await admin.firestore().collection("users").doc(userId).collection("wallets").doc(walletId).get()

      if (!doc.exists) {
        throw Error()
      }

      const wallet = doc.data() as Wallet
      if (!wallet.wallet) {
        throw Error()
      }
      const account = SimpleWallet.readFromWLT(wallet.wallet).open(new Password(userId))

      const signature = account.signMessage(data)

      res.status(200).send(signature)
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)