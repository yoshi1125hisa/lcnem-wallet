import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const _refreshAccessToken = functions.https.onRequest(
  (req, res) => {
    try {
      const userId = req.body.userId as string
      const walletId = req.body.walletId as string

      if (!userId || !walletId) {
        throw Error()
      }

      
    } catch (e) {
      console.error(e)
      res.status(400).send(e.message)
    }
  }
)
