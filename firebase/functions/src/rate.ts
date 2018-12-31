import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest((req, res) => {
  try {
    const jpy = new Promise(
      () => {
        request.get(
          'http://apilayer.net/api/' + 'live' + '?access_key=' + functions.config().currency_layer.api_key + 'format=1',
          async (error, res, body) => {
            const jsonResponse = JSON.parse(body)
            const jpy = 1 / jsonResponse['quotes']['USDJPY']

            await admin.firestore().collection("rates").doc("rate").set(
              {
                "JPY": jpy,
                "USD": 1
              }
            )
          }
        )
      }
    )

    const others = new Promise(
      () => {
        const btc = "1";
        const xem = "873";
        const eth = "1027";
        const ids = [btc, xem, eth]

        ids.map(
          (id) => {
            request.get(
              {
                uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=' + id,
                headers: {
                  'X-CMC_PRO_API_KEY': functions.config().coin_market_cap.api_key
                }
              }, async function (error, res, body) {
                if (error) {
                } else {
                  const jsonResponse = await JSON.parse(body);
                  const name = String(jsonResponse['data'][`${id}`]['name'])
                  const price = jsonResponse['data'][`${id}`]['quote']['USD']['price'];
                  const rate = {}
                  rate[`${name}`] = price

                  await admin.firestore().collection("rates").doc("rate").set(rate)
                }
              }
            )
          }
        )
      }
    )
    Promise.all([jpy, others]).then(
      () => {
        res.status(200).send()
      }
    )
  } catch (e) {
    console.error(e)
    res.status(400).send(e.message)
  }
});