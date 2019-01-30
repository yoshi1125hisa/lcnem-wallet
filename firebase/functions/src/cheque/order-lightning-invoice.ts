import * as functions from 'firebase-functions';

export const _orderLightningInvoice = functions.https.onRequest(
  (req, res) => {
    try {
      const nem = req.body.nem as string
      const currency = req.body.currency as string
      const amount = req.body.amount as number
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)