import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest((req, res) => {
  try {
    const jpyPromise = new Promise(
      function (resolve, reject) {
        request.get(
          'http://apilayer.net/api/' + 'live' + '?access_key=' + functions.config().currency_layer.api_key + 'format=1',
          function (error, res, body) {
            const jsonResponse = JSON.parse(body)
            resolve({ "JPY": 1 / jsonResponse['quotes']['USDJPY'] })
          }
        )
      }
    )

    const enum CryptIds {
      BTC = "1",
      XEM = "873",
      ETH = "1027"
    }
    const cryptIds = [CryptIds.BTC, CryptIds.XEM, CryptIds.ETH]
    const cryptPromisses = cryptIds.map<{}>(
      async (id) => {
        await new Promise(
          function (resolve, reject) {
            request.get(
              {
                uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=' + id,
                headers: {
                  'X-CMC_PRO_API_KEY': functions.config().coin_market_cap.api_key
                }
              }, function (error, res, body) {
                if (error) {
                } else {
                  const jsonResponse = JSON.parse(body);
                  const name = String(jsonResponse['data'][`${id}`]['name'])
                  const price = jsonResponse['data'][`${id}`]['quote']['USD']['price'];
                  const rate = {}
                  resolve(rate[`${name}`] = price)
                }
              }
            )
          }
        )
      }
    )
    const ratePromisses = cryptPromisses
    ratePromisses.push(jpyPromise)

    Promise.all(ratePromisses).then(async function (message) {
      var obj = Object()
      message.forEach(function (el) {
        obj.assign(el)
      })
      await admin.firestore().collection("rates").doc("rate").set(obj)
    }).then(function () {
      res.status(200).send()
    })
  } catch (e) {
    console.error(e)
    res.status(400).send(e.message)
  }
});