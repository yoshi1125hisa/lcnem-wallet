import * as functions from 'firebase-functions';

import * as request from 'request';
import { SignedTransaction } from 'nem-library';
import { receiveLcnemCheque } from '../routines/lcnem-cheque';

export const _orderCash = functions.https.onRequest(
  async (req, res) => {
    try {
      const email = req.body.email as string
      const nem = req.body.nem as string
      const currency = req.body.currency as string
      const method = req.body.method as string
      const lang = req.body.lang as string
      const signed: SignedTransaction = {
        data: req.body.data as string,
        signature: req.body.signature as string
      }

      if (!email || !nem || !currency || !method || !lang) {
        throw Error()
      }

      const amount = await receiveLcnemCheque(signed, "JPY")
      
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
          res.status(200).send()
        }
      )
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)
