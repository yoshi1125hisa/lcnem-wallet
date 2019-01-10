import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';
export const _rate = functions.https.onRequest((req, res) => {
  try {
    const rate = {}
    const jpyPromise = new Promise(
      function (resolve, reject) {
        request.get(
          functions.config().currency_layer.rate_api,
          function (error, response, body) {
            if (!error && response) {
              const jsonResponse = JSON.parse(body)
              console.log(jsonResponse)
              rate['JPY'] = jsonResponse['quotes']['USDJPY']
              resolve(
                rate
              )
            }
          }
        )
      }
    )
    const cryptoPromise = new Promise(
      function (resolve, reject) {
        request.get(
          {
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=' + "BTC,XEM,ETH",
            headers: {
              'X-CMC_PRO_API_KEY': functions.config().coin_market_cap.api_key
            }
          }, function (error, response, body) {
            if (!error && response) {
              const jsonResponse = JSON.parse(body);
              console.log(jsonResponse)
              rate['BTC'] = jsonResponse['data']['BTC']['quote']['USD']['price'];
              rate['XEM'] = jsonResponse['data']['XEM']['quote']['USD']['price'];
              rate['ETH'] = jsonResponse['data']['ETH']['quote']['USD']['price'];
              rate['USD'] = 1
              resolve(
                rate
              )
            }
          }
        )
      }
    )

    Promise.all([cryptoPromise, jpyPromise])
      .then(
        async function (message) {
          await admin.firestore().collection("rates").doc("rate").set(
            message[0],
            message[1]
          )
        }
      ).then(
        () =>
          res.status(200).send()
      ).catch(
        e => console.error(e)
      );
  } catch (e) {
    console.error(e)
    res.status(400).send(e.message)
  }
});