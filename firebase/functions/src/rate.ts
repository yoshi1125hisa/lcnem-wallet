import * as functions from 'firebase-functions';
import * as request from 'request';
import * as admin from 'firebase-admin';

export const _rate = functions.https.onRequest((req, res) => {
  try {
    const jpy = new Promise(
      function (resolve, reject) {
        resolve(
          request.get(
            'http://apilayer.net/api/' + 'live' + '?access_key=' + functions.config().currency_layer.api_key + 'format=1',
            function (error, res, body) {
              const jsonResponse = JSON.parse(body)
              return { "JPY": 1 / jsonResponse['quotes']['USDJPY'] }
            }
          )
        )
      }
    )

    const btc = "1";
    const xem = "873";
    const eth = "1027";
    const ids = [btc, xem, eth]
    const others = ids.map<{}>(
      async (id) => {
        await new Promise(
          function (resolve, reject) {
            resolve(
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
                    rate[`${name}`] = price
                  }
                }
              )
            )
          }
        )
      }
    )
    others.push(jpy)

    Promise.all(others).then(async function (message) {
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