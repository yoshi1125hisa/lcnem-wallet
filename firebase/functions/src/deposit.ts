import * as functions from 'firebase-functions';

import * as request from 'request';

export const _deposit = functions.https.onRequest((req, res) => {
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
    console.error(e);
    res.status(400).send(e.message);
  }
});
