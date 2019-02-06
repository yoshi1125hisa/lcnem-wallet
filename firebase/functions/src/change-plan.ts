import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import {
  SignedTransaction
} from 'nem-library';

import { receiveLcnemCheque } from './routines/lcnem-cheque';
import { User } from './models/user';
import { Timestamp } from '@google-cloud/firestore';

export const _changePlan = functions.https.onRequest(
  async (req, res) => {
    try {
      const userId = req.body.userId as string
      const plan = req.body.plan as string

      const doc = await admin.firestore().collection("users").doc(userId).get()
      if (!doc.exists) {
        throw Error()
      }
      const user = doc.data() as User

      switch (plan) {
        case "Free": {
          await doc.ref.set(
            {
              ...user,
              plan: undefined
            } as User
          )
          res.status(200).send()
          return
        }

        case "Standard":
        case "Premium": {
          break
        }
        default: {
          throw Error()
        }
      }

      const months = Number(req.body.months)
      const signed: SignedTransaction = {
        data: req.body.data as string,
        signature: req.body.signature as string
      }

      if (!userId || !Number.isInteger(months) || !signed.data || !signed.signature) {
        throw Error()
      }

      const price = {
        "Standard": 200,
        "Premium": 600
      }
      const amount = await receiveLcnemCheque(signed, "JPY")
      if (amount < months * price[plan]) {
        throw Error()
      }
      let timeStamp = doc.get('created_at')
      let before = timeStamp.toDate()

      if (user.plan && user.plan.type) {
        if (user.plan.type === plan) {
          before = new Date(user.plan.expire)
        }
      }

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
