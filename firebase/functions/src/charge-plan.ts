import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import {
  SignedTransaction
} from 'nem-library';

import { receiveLcnemCheque } from './payment/lcnem-cheque';
import { User } from './models/user';

const price = {
  "Standard": 200,
  "Premium": 600
}

export const _chargePlan = functions.https.onRequest(
  async (req, res) => {
    try {
      const userId = req.body.userId as string
      const plan = req.body.plan as string
      const months = Number(req.body.months)
      const signed: SignedTransaction = {
        data: req.body.data as string,
        signature: req.body.signature as string
      }

      if (!userId || !Number.isInteger(months) || !signed.data || !signed.signature) {
        throw Error()
      }
      switch (plan) {
        case "Standard":
        case "Premium": {
          break
        }
        default: {
          throw Error()
        }
      }

      const amount = await receiveLcnemCheque(signed, "JPY")
      if (amount < months * price[plan]) {
        throw Error()
      }

      const doc = await admin.firestore().collection("users").doc(userId).get()
      if (!doc.exists) {
        throw Error()
      }
      const user = doc.data() as User

      const now = new Date()
      const expire = user.plan ? new Date(user.plan.expire) : now
      const before = expire > now ? expire : now
      before.setMonth(before.getMonth() + months)

      await doc.ref.set(
        {
          ...user,
          plan: {
            type: plan,
            expire: before.toISOString()
          }
        } as User
      )

      res.status(200).send()
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)
